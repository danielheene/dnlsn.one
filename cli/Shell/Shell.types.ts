import { Answers, ListQuestion, QuestionMap } from 'inquirer';

// TODO: refactor to Enquirer
// type EnquirerOptions = Parameters<typeof prompt>;

export type InquirerDefaultQuestionProps = QuestionMap[keyof QuestionMap];
export type InquirerMissingQuestionProps = {
  askAnswered?: boolean;
  maxLength?: number;
};

type InquirerOptionTypesWithExtensions =
  | InquirerDefaultQuestionProps['type']
  | 'maxlength-input';

export type ShellCommandGeneralQuestion = Omit<
  InquirerDefaultQuestionProps & InquirerMissingQuestionProps,
  'type'
> & { type: InquirerOptionTypesWithExtensions };

export type ShellCommandRootQuestion = ListQuestion &
  InquirerMissingQuestionProps;

export type ShellCommandQuestion =
  | ShellCommandGeneralQuestion
  | ShellCommandRootQuestion;

export type ShellCommandGeneralIdentifier =
  | 'init'
  | 'init:site'
  | 'init:theme'
  | 'init:links';
export type ShellCommandRootIdentifier = 'root';
export type ShellCommandIdentifier =
  | ShellCommandRootIdentifier
  | ShellCommandGeneralIdentifier;

export type ShellCommandScopeIdentifier = 'init';

export type ShellSubscriptionCallbacks = {
  next?: (value: Answers) => void;
  error?: (error: Error) => void;
  complete?: () => void;
};

/**
 *
 *
 */
type ShellCommandSharedProps = {
  label?: string;
  backLabel?: string;
};

export type ShellCommandRoot = {
  id: ShellCommandRootIdentifier;
  question: ShellCommandQuestion;
} & ShellCommandSharedProps;

export type ShellCommandGeneral = {
  id: ShellCommandGeneralIdentifier;
  parent: ShellCommandIdentifier;
  questions?: ShellCommandQuestion[];
} & ShellCommandSharedProps;

export type ShellCommand = ShellCommandRoot | ShellCommandGeneral;

/**
 *
 *
 */
export interface ShellState {
  view: {
    current: ShellCommandIdentifier;
    previous: ShellCommandIdentifier | null;
  };
  config: {
    title?: string;
    url?: string;
    description?: string;
  };
}

/**
 *
 *
 */
export interface ShellParams {
  commands: ShellCommandGeneral[];
  initialState: ShellState;
}

export type ShellCommandListChoice = {
  name: string;
  value: string;
};
