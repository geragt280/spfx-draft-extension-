import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
// import { Dialog } from '@microsoft/sp-dialog';
import { sp } from '@pnp/sp';
import SidePanel from './Components/SidePanel';
import * as strings from 'DraftAssignorCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDraftAssignorCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

export interface IReactHeaderFooterApplicationCustomizerProperties {  
  // This is an example; replace with your own property  
  Bottom: string;  
} 

const LOG_SOURCE: string = 'DraftAssignorCommandSet';

export default class DraftAssignorCommandSet extends BaseListViewCommandSet<IDraftAssignorCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized DraftAssignorCommandSet');

    return Promise.resolve().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length > 0;
      if (event.selectedRows.length > 0) {
        
      }
    }
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        const panel: SidePanel = new SidePanel(this.context, "", []);
        panel.show();
        break;
      // case 'COMMAND_2':
      //   Dialog.alert(`${this.properties.sampleTextTwo}`);
      //   break;
      default:
        throw new Error('Unknown command');
    }
  }
}
