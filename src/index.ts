import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ReadonlyPartialJSONObject,
} from '@lumino/coreutils';

import { 
  INotebookTracker, 
  NotebookPanel, 
} from '@jupyterlab/notebook';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the grundkurs_theme extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'grundkurs_theme:plugin',
  autoStart: true,
  requires: [INotebookTracker, IThemeManager],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker, manager: IThemeManager) => {
    const { commands, shell } = app;
    const command = 'grundkurs:send-feedback';
    commands.addCommand(command, {
      label: 'Send feedback for this assignment',
      execute: args => {
        const current = getCurrent(tracker, shell, args);
        if (current) {
          // Log cellid of current active cell
          console.log(current.content.activeCell?.model?.modelDB.basePath)
        }
      },
    });

    console.log('JupyterLab extension grundkurs_theme is activated!');
    const style = 'grundkurs_theme/index.css';

    manager.register({
      name: 'grundkurs_theme',
      isLight: true,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  }
};

// Get the current widget and activate unless the args specify otherwise.
function getCurrent(
  tracker: INotebookTracker,
  shell: JupyterFrontEnd.IShell,
  args: ReadonlyPartialJSONObject
): NotebookPanel | null {
  const widget = tracker.currentWidget;
  const activate = args['activate'] !== false;

  if (activate && widget) {
    shell.activateById(widget.id);
  }

  return widget;
}

export default plugin;
