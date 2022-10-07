import * as React from 'react';
import { sp } from "@pnp/sp";
import { IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import { Label, PrimaryButton } from '@fluentui/react';

interface DialogProps {
    dialogClose: any;
    errorReason: string;
    context: any;
    selectedRows: any[];
}

const ErrorDialogBody = ({dialogClose, context, errorReason, selectedRows} : DialogProps) => {

    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [choices, setchoices] = React.useState<string[]>([]);
    const [ErrorSet, setErrorSet] = React.useState(false);

    const onSelectedItem = (item) => {
        console.log("selected items:", selectedRows);
        setErrorMessage(item.target.value);
    };

    const getFieldInformation = async () => {
        const field : IFieldInfo = await sp.web.lists.getByTitle("Auction").fields.getByInternalNameOrTitle("Error_x0020_Reason")();
        setchoices(field.Choices);
        // console.log("field data", field.Choices);
    };

    React.useEffect(() => {
      setErrorMessage(choices[0]);
    
    }, [choices]);

    const CloseAll = () =>{
        setErrorSet(true);
        setTimeout(()=>{dialogClose(); 
            setErrorSet(false);}, 1000);
    };    

    const SetError = async () => {
        try {
            for (let i = 0; i < selectedRows.length; i++) {
                const result = await sp.web.lists.getById(context.pageContext.list.id).items.getById(selectedRows[i].getValueByName("ID")).validateUpdateListItem([
                {
                    FieldName: "Error_x0020_Reason",
                    FieldValue: ErrorMessage,
                },
                {
                    FieldName: "Error",
                    FieldValue: "true"
                },
                {
                    FieldName: "Status",
                    FieldValue: "Drafted"
                }]);
                // var element = await sp.web.lists.getById(context.pageContext.list.id).items.getById(selectedRows[i].getValueByName("ID")).update({
                //     "ErrorReason": ,
                //     Error: true
                // });
                // console.log("Element inserted", result);
            }
            CloseAll();
        } catch (error) {
            console.error(error);
            CloseAll();
        }
    };

    React.useEffect(() => {
      console.log("Context", context);
      getFieldInformation();
    }, []);
    

    return (
        <div style={{padding:20, textAlign:'center'}}>
            <Label>Select the error reason</Label>
            <select 
                // value={choices}
                style={{
                    padding:10,
                    margin: 5,
                    fontSize:13,
                    backgroundColor:'wheat',
                    top:5,
                    bottom:5
                }}
                defaultValue={errorReason} 
                onChangeCapture={onSelectedItem.bind(this)}
                >
                {choices.map((e) => {
                    return (<option value={e}>{e}</option>);
                })}
            </select>
            <div style={{top:20, padding: 5}} >
                <PrimaryButton onClick={() => SetError()}>Set Error</PrimaryButton>
            </div>
            { ErrorSet && <Label style={{color:'#8A650A', fontSize:12}}>Listing edited successfully</Label>}
        </div>
    );
};

export default ErrorDialogBody;
