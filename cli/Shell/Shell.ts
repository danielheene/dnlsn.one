import { Subject, Subscription } from 'rxjs';
import inquirer, { Answers, Inquirer } from 'inquirer';
import MaxLengthInputPrompt from 'inquirer-maxlength-input-prompt';
import clear from 'clear';
import { default as merge } from 'lodash.merge';

import {
  ShellCommand,
  ShellCommandGeneral,
  ShellCommandIdentifier,
  ShellCommandListChoice,
  ShellCommandQuestion,
  ShellCommandRoot,
  ShellParams,
  ShellState,
  ShellSubscriptionCallbacks,
} from './Shell.types';
import { commands } from './Shell.config';
import { printShellBanner } from './Shell.banner';
import Separator from 'inquirer/lib/objects/separator';

const initialState: ShellState = {
  view: {
    current: 'root',
    previous: null,
  },
  config: {},
};

/**
 *
 */
export const Shell = new (class {
  /**
   * subscription configuration
   */
  #state: ShellState;
  #state$: Subject<ShellState>;
  #stateCallbacks: ShellSubscriptionCallbacks[] = [];
  #prompts$: Subject<ShellCommandQuestion>;
  #promptCallbacks: ShellSubscriptionCallbacks[] = [];
  #subscriptions: Subscription[] = [];

  /**
   * external module bindings
   */
  readonly #clear: typeof clear;
  readonly #inquirer: Inquirer;
  readonly #merge: typeof merge;

  /**
   * initial data
   */
  #shellCommands: ShellCommandGeneral[];
  #shellCommandRoot: ShellCommandRoot;
  #shellCommandQuestionBundles: Record<
    string,
    ShellCommandGeneral['questions']
  > = {};

  /**
   * handles next callbacks on prompt subscription
   */
  #handlePromptChanges = (nextValue: Answers): void => {
    console.log('handlePromptChanges', nextValue);
    if (
      nextValue.name === 'view' &&
      nextValue.answer !== this.#state.view.current
    ) {
      console.log('handlePromptChanges:', 'view has changed');
      this.#setView(nextValue.answer);
    }
    // const command = this.#shellCommands.find(
    //   (command) => command.id === nextValue.answer
    // );
    // console.log(nextValue);
    // if (
    //   'questions' in command &&
    //   command.questions &&
    //   command.questions.length > 0
    // )
    //   this.#prompts$.next(command.questions);
    // else this.#prompts$.next(this.#shellCommandRoot.question);

    this.#promptCallbacks
      .filter((callback) => 'next' in callback)
      .forEach(({ next }) => next(nextValue));
  };

  /**
   * handles error callbacks on prompt subscription
   */
  #handlePromptErrors = ({ name, message }: Error): void => {
    this.#promptCallbacks
      .filter((callback) => 'error' in callback)
      .forEach(({ error }) => error({ name, message }));
  };

  /**
   * handles complete callbacks on prompt subscription
   */
  #handlePromptCompletion = (): void => {
    this.#promptCallbacks
      .filter((callback) => 'complete' in callback)
      .forEach(({ complete }) => complete());
  };

  /**
   * handles next callbacks on state subscription
   */
  #handleStateChanges = (nextValue: ShellState): void => {
    console.log('handleStateChanges:', nextValue);
    this.#state = nextValue;
    this.#stateCallbacks
      .filter((callback) => 'next' in callback)
      .forEach(({ next }) => next(nextValue));
  };

  /**
   * handles error callbacks on prompt subscription
   */
  #handleStateErrors = ({ name, message }: Error): void => {
    this.#stateCallbacks
      .filter((callback) => 'error' in callback)
      .forEach(({ error }) => error({ name, message }));
  };

  /**
   * handles complete callbacks on prompt subscription
   */
  #handleStateCompletion = (): void => {
    this.#stateCallbacks
      .filter((callback) => 'complete' in callback)
      .forEach(({ complete }) => complete());
  };

  #setState = (
    nextState: Partial<ShellState>,
    callback?: (nextState: ShellState) => void
  ): void => {
    const prevState: ShellState = JSON.parse(JSON.stringify(this.#state));
    const state: ShellState = this.#merge<ShellState, Partial<ShellState>>(
      prevState,
      nextState
    );

    console.log('setState:', [prevState, nextState]);

    this.#state$.next(state);
    callback && callback(state);
  };

  #setView = (nextView: ShellCommandIdentifier) => {
    const previousView: ShellCommandIdentifier = JSON.parse(
      JSON.stringify(this.#state.view.current)
    );
    if (nextView === previousView) return;

    this.#setState(
      { view: { current: nextView, previous: previousView } },
      (state) => this.#generateViewItems(state.view.current)
    );
  };

  #generateBundledCommand = (
    view: ShellCommandIdentifier
  ): ShellCommandListChoice | void => {
    const bundleIdentifier = `${view}:bundled`;
    const bundleChoice = {
      name: `Run all ${view} tasks?`,
      value: bundleIdentifier,
    };

    if (
      this.#shellCommandQuestionBundles &&
      typeof this.#shellCommandQuestionBundles === 'object' &&
      Object.prototype.hasOwnProperty.call(
        this.#shellCommandQuestionBundles,
        bundleIdentifier
      )
    ) {
      return bundleChoice;
    }

    const viewCommand = this.#shellCommands.find((cmd) => cmd.id === view);
    const viewChildren = this.#shellCommands.filter(
      (cmd) => cmd.parent === view
    );
    const viewChildrenWithQuestions = viewChildren.filter((child) =>
      Object.prototype.hasOwnProperty.call(child, 'questions')
    );
    if (!viewCommand || !viewChildren || !viewChildrenWithQuestions) return;

    // prevent root node from bundling its task
    const isNotRootView = view !== 'root';

    // dont generate bundled view if already in a bundled view
    const isNotBundledView = !view.endsWith(':bundled');

    // determine that this view does not include questions
    const isOverviewView = !Object.prototype.hasOwnProperty.call(
      viewCommand,
      'questions'
    );
    // has children which include bundled questions
    const isQuestionParentView = viewChildrenWithQuestions?.length > 1; // also evaluate if there is more then one child for bundling tasks

    if (
      isNotRootView &&
      isNotBundledView &&
      isOverviewView &&
      isQuestionParentView
    ) {
      this.#shellCommandQuestionBundles[
        bundleIdentifier
      ] = viewChildrenWithQuestions?.map((child) => child.questions).flat();

      return bundleChoice;
    }
  };

  #generateBackLinkCommand = (
    view: ShellCommandIdentifier
  ): ShellCommandListChoice | void => {
    const viewCommand =
      view !== 'root'
        ? this.#shellCommands.find((cmd) => cmd.id === view)
        : this.#shellCommandRoot;

    if (!viewCommand) {
      throw new Error('command not found!');
    }

    const re = new RegExp(/(?=.+)(:*[A-Za-z0-9]+)$/gm);
    const isRootView = view === 'root';
    const isBundledView = view.endsWith(':bundled');
    const isQuestionView = Object.prototype.hasOwnProperty.call(
      viewCommand,
      'questions'
    );
    const noParentView = !Object.prototype.hasOwnProperty.call(
      viewCommand,
      'parent'
    );

    if (isRootView || isBundledView || isQuestionView || noParentView) return;

    const parentId = view.replace(re, '');
    const parentView =
      this.#shellCommands.find((cmd) => cmd.id === parentId) ||
      this.#shellCommandRoot;

    return {
      name: parentView.backLabel || `Back to: ${parentView.label}`,
      value: parentView.id,
    };
  };

  #generateViewItems = (view: ShellCommandIdentifier) => {
    const bundledCommand = this.#generateBundledCommand(view);
    const backLinkChoice = this.#generateBackLinkCommand(view);
    const listViewHeader = bundledCommand
      ? [bundledCommand, new Separator()]
      : [];
    const listViewFooter = backLinkChoice
      ? [new Separator(), backLinkChoice]
      : [];

    const viewChoices = this.#shellCommands
      .filter((cmd) => cmd.parent === view)
      .map((cmd) => ({
        name: cmd.label,
        value: cmd.id,
      }));

    const viewQuestions: ShellCommandQuestion = {
      type: 'list',
      name: 'view',
      message: 'What shall I do?',
      choices: [...listViewHeader, ...viewChoices, ...listViewFooter],
      loop: false,
      askAnswered: true,
    };

    this.#prompts$.next(viewQuestions);
  };

  /**
   * determine root command output from subcommands and other data
   */
  #generateShellCommandRoot = () => {
    if (this.#shellCommandRoot) {
      this.#prompts$.next(this.#shellCommandRoot.question);
    }

    const rootDependents = this.#shellCommands.filter(
      (cmd) => cmd.parent === 'root'
    );
    const rootChoices = rootDependents.map((command) => ({
      name: command.label,
      value: command.id,
    }));

    const rootCommand: ShellCommand = {
      id: 'root',
      backLabel: 'Back to overview',
      question: {
        type: 'list',
        name: 'view',
        choices: rootChoices,
        loop: false,
        askAnswered: true,
      },
    };

    this.#shellCommandRoot = rootCommand;
    this.#prompts$.next(rootCommand.question);
  };

  // #generateQuestionFromCommandIdentifier = (
  //   identifier: ShellCommandGeneralIdentifier = 'root'
  // ): Question => {
  //   const { id, label, parent, ...questionData } =
  //     identifier === 'root'
  //       ? this.#shellCommandRoot
  //       : this.#shellCommands.find((command) => command.id === identifier);
  //
  //   // extend choices from children
  //   if (questionData.type === 'list') {
  //     questionData.choices = questionData.choices || [];
  //     questionData.choices = [
  //       ...questionData.choices,
  //       ...this.#shellCommands
  //         .filter((command) => command.parent === id)
  //         .map((command) => command.label),
  //     ];
  //   }
  //
  //   return questionData;
  // };

  /**
   * register subscription on prompt changes
   */
  #registerPromptSubscription = (): void => {
    this.#subscriptions.push(
      this.#inquirer
        .prompt(this.#prompts$ as any) // eslint-disable-line
        .ui.process.subscribe(
          this.#handlePromptChanges,
          this.#handlePromptErrors,
          this.#handlePromptCompletion
        )
    );
  };

  /**
   * add callbacks to prompt subscription
   */
  #registerPromptSubscriptionCallbacks = (
    callbacks: ShellSubscriptionCallbacks
  ): void => {
    this.#promptCallbacks.push(callbacks);
  };

  /**
   * register subscription on state changes
   */
  #registerStateSubscription = (): void => {
    this.#subscriptions.push(
      this.#state$.subscribe(
        this.#handleStateChanges,
        this.#handleStateErrors,
        this.#handleStateCompletion
      )
    );
  };

  /**
   * add callbacks to state subscription
   * @param callbacks
   */
  #registerStateSubscriptionCallbacks = (
    callbacks: ShellSubscriptionCallbacks
  ): void => {
    this.#stateCallbacks.push(callbacks);
  };

  /**
   * unsubscribe from all subscribers
   */
  #unsubscribeAllSubscriptions = (): void => {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
  };

  /**
   * print bordered terminal banner with app
   */
  #printTerminalBanner = (): void => printShellBanner();

  /**
   * remove previous output from terminal
   */
  #clearTerminalScreen = (): void => {
    if (!process.stdout.isTTY) return;
    this.#clear({ fullClear: true });
  };

  /**
   * create Shell instance configuration and run bootstrap tasks
   */
  #create = (): void => {
    console.log('create:', 'stared');
    this.#clearTerminalScreen();
    this.#printTerminalBanner();
    this.#registerPromptSubscription();
    this.#registerStateSubscription();
    this.#generateShellCommandRoot();
    console.log('create:', 'done');
  };

  /**
   * cleanup Shell instance configuration and exit script
   */
  #destroy = (exitCode = 0): void => {
    this.#unsubscribeAllSubscriptions();
    process.exit(exitCode);
  };

  /**
   * public method wrapper for private create method
   */
  public readonly create = (): void => this.#create();

  /**
   * public method wrapper for private destroy method
   */
  public readonly destroy = (): void => this.#destroy(0);

  /**
   * public method wrapper for private prompt subscription callback handler
   */
  public readonly addPromptSubscription = (
    callbacks: ShellSubscriptionCallbacks
  ): void => this.#registerPromptSubscriptionCallbacks(callbacks);

  /**
   * public method wrapper for private state subscription callback handler
   */
  public readonly addStateSubscription = (
    callbacks: ShellSubscriptionCallbacks
  ): void => this.#registerStateSubscriptionCallbacks(callbacks);

  /**
   * Shell constructor which bind external libraries and configs
   */
  constructor({ commands, initialState }: ShellParams) {
    this.#prompts$ = new Subject<ShellCommandQuestion>();
    this.#state$ = new Subject<ShellState>();
    this.#state = initialState;
    this.#clear = clear;
    this.#inquirer = inquirer;
    this.#merge = merge;
    this.#shellCommands = commands;

    this.#inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt);
    // this.#inquirer.registerPrompt(
    //   'search-list',
    //   require('inquirer-search-list')
    // );
    // this.#inquirer.registerPrompt('loop', require('inquirer-loop')(inquirer));
  }
})({
  commands,
  initialState,
});
