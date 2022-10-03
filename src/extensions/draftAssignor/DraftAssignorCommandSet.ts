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
import { SPField } from '@microsoft/sp-page-context';
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

const LOG_SOURCE: string = 'DraftAssignorCommandSet';

export default class DraftAssignorCommandSet extends BaseListViewCommandSet<IDraftAssignorCommandSetProperties> {

  private panel: SidePanel = null;
  private oldPerson: string = null;
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized DraftAssignorCommandSet');

    return Promise.resolve().then(_ => {
      sp.setup({
        spfxContext: this.context
      });

    });
  }

  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    this.panel = null;
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      // console.log("Context list name", this.context.pageContext.list.title);
      compareOneCommand.visible = event.selectedRows.length > 0 && this.context.pageContext.list.title == "Auction";
      if (event.selectedRows.length > 0 && this.context.pageContext.list.title == "Auction") {
        if(event.selectedRows.length == 1 && event.selectedRows[0].getValueByName("Drafter").length){
          this.oldPerson = event.selectedRows[0].getValueByName("Drafter")[0].email;
        }
        else
          this.oldPerson = "";
        // console.log("Selected Items", );
      }
      
    }
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        this.panel = new SidePanel(this.context, this.oldPerson, event.selectedRows);
        this.panel.show();
        
        break;
      // case 'COMMAND_2':
      //   Dialog.alert(`${this.properties.sampleTextTwo}`);
      //   break;
      default:
        throw new Error('Unknown command');
    }
  }
}
