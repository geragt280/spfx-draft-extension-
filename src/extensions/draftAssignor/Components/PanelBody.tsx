import * as React from 'react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Panel, PanelType, PrimaryButton } from '@fluentui/react';

interface PanelProps {
    dialogClose: any;
    selectedPerson: string;
    context: any;
    selectedRows: any[];
}

export default function PanelBody({dialogClose, context, selectedPerson, selectedRows} : PanelProps){

    const [panelOpen, setpanelOpen] = React.useState(true);
    const [personSelected, setpersonSelected] = React.useState("");
    const [spList, setspList] = React.useState(null);

    const _getPeoplePickerItems = (items: any[]) => {
        setpersonSelected(items[0].loginName);
        // console.log('Items:', items[0].loginName);
    };

    React.useEffect(() => {
    //   console.log("useEffect Ran");
      
    }, []);

    const closeDialogBox = () => {
        setpanelOpen(false);
        setpersonSelected("");
        dialogClose();
    };
    

    async function setListItems(){
        // console.log("Setter invoked");
        try {
            for (let i = 0; i < selectedRows.length; i++) {
                var element : any = await sp.web.lists.getById(context.pageContext.list.id).items.getById(selectedRows[i].getValueByName("ID")).validateUpdateListItem([{
                    FieldName: "Drafter",
                    FieldValue: JSON.stringify([{ "Key": personSelected }]),
                }]);
                element = await sp.web.lists.getById(context.pageContext.list.id).items.getById(selectedRows[i].getValueByName("ID")).update({
                    Status: "Pending"
                });
            }
            closeDialogBox();
        } catch (error) {
            console.error(error);
            closeDialogBox();
        }
        
    }

  return (
        // <Panel
        //     isOpen={ panelOpen }
        //     onDismiss={() => {
        //         setpanelOpen(false);
        //         // dialogClose(); 
        //     }
        //     }
        //     // onDismissed={() => }
        //     headerText={"Assign Draft"}
        //     >
        <div style={{paddingLeft:20, paddingRight: 20, paddingBottom: 20}}>
                <h5 >Select the person to assign the draft</h5>
                <PeoplePicker
                    context={context}
                    titleText="Search Person"
                    personSelectionLimit={1}
                    defaultSelectedUsers={[selectedPerson]}
                    // groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    selectedItems={_getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />
                    <br />
                    <PrimaryButton onClick={() => setListItems()}>
                        Assign
                    </PrimaryButton>
        </div>
  );
}
