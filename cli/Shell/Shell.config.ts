import { ShellCommandGeneral } from './Shell.types';

const initCommands: ShellCommandGeneral[] = [
  {
    id: 'init',
    parent: 'root',
    label: 'Initialize site configuration',
  },
  {
    id: 'init:site',
    parent: 'init',
    label: 'Initialize static site data',
    questions: [
      {
        name: 'title',
        type: 'input',
        message: 'Enter site title',
      },
      {
        name: 'url',
        type: 'input',
        message: 'Enter site URL',
      },
      {
        name: 'description',
        type: 'maxlength-input',
        message: 'Enter site description',
        maxLength: 120,
      },
    ],
  },
  {
    id: 'init:theme',
    parent: 'init',
    label: 'Initialize basic theme',
    questions: [
      {
        name: 'primaryColor',
        type: 'input',
        message: 'Define primary color',
      },
      {
        name: 'secondaryColor',
        type: 'input',
        message: 'Define secondary color',
      },
      {
        name: 'baseFontSize',
        type: 'input',
        message: 'Define font size basis',
        default: '62.5%',
      },
      {
        name: 'disableZoom',
        type: 'confirm',
        message: 'Should your page be zoomable?',
        default: true,
      },
    ],
  },
];
export const commands: ShellCommandGeneral[] = [...initCommands];
