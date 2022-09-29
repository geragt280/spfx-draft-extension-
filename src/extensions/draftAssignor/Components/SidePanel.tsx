import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { BaseButton } from 'office-ui-fabric-react';
import { Panel, PanelType, PrimaryButton } from '@fluentui/react';

export default class SidePanel extends BaseDialog {

    public context = null;
    public person = null;
    public selectedIds = [];
    constructor(context, person, selectedIds){
        super();

        this.context = context;
        this.person = person;
        this.selectedIds = selectedIds;
        console.log("context", this.context);
    }

  public render(): void {
    

    const _getPeoplePickerItems = (items: any[]) => {
        console.log('Items:', items);
    };

    async function getListItems(){
        const items: any[] = await sp.web.lists.getByTitle("Personal Information of User").items();
        if (items) {
            console.log("Response", items);
            
        }
    }
    
    var x = document.getElementsByClassName("ms-Dialog-main");
    x.item(0).setAttribute("hidden", "true");
    var panelOpen = true;

    ReactDOM.render(
    
        <Panel
            isOpen={ panelOpen }
            onDismiss={() => {this.close(); panelOpen = false;}}
            // onDismissed={() => }
            headerText={"Assign Draft"}
            >
                <h5>Select the person to assign the draft</h5>
                <PeoplePicker
                    context={this.context}
                    titleText="Search Person"
                    personSelectionLimit={1}
                    defaultSelectedUsers={[this.person]}
                    // groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    selectedItems={_getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />
                    <br />
                    <PrimaryButton onClick={() => getListItems()}>
                        Assign
                    </PrimaryButton>
        </Panel>
    
    , this.domElement);
  }  
}