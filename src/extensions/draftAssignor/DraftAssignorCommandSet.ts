import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
// import { Dialog } from '@microsoft/sp-dialog';
import { sp } from '@pnp/sp';
import AssignPanel from './Components/AssignPanel';
import ErrorDialog from './Components/ErrorDialog';

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

  private panel: AssignPanel = null;
  private dialog: ErrorDialog = null;
  private oldPerson: string = null;
  private oldReason: string = null;
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
    const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    // console.log("event ", event);
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      try {
        compareOneCommand.visible = event.selectedRows.length > 0 && this.context.pageContext.list.title == "Auction";
        if (event.selectedRows.length > 0 && this.context.pageContext.list.title == "Auction") {
          if(event.selectedRows.length == 1 && event.selectedRows[0].getValueByName("Drafter")){
            this.oldPerson = event.selectedRows[0].getValueByName("Drafter")[0].email;
          }
          else
            this.oldPerson = "";
          // console.log("Selected Items", );
        }
      } catch (error) {
        console.log("Error Drafter Command", error);
      }
      
      
    }
    if(compareTwoCommand){
      try {
        compareTwoCommand.visible = event.selectedRows.length > 0 && this.context.pageContext.list.title == "Auction";
        if(event.selectedRows.length == 1 && event.selectedRows[0].getValueByName("Error_x0020_Reason")){
          this.oldReason = event.selectedRows[0].getValueByName("Error_x0020_Reason")[0];
        }
        else
          this.oldPerson = "";
      } catch (error) {
        console.log("Error Error Command", error);
      }
      
    }

  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        this.panel = new AssignPanel(this.context, this.oldPerson, event.selectedRows);
        this.panel.show();
        break;
      case 'COMMAND_2':
        this.dialog = new ErrorDialog(this.context, this.oldReason, event.selectedRows);
        this.dialog.show();
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
