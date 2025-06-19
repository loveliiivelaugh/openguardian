import FormContainer from "@components/custom/forms/FormContainer";
import useUtilityStore from "@store/utilityStore";

export function IntegrationForm({ columns, userId, onSubmit }: { columns?: any, userId?: string, onSubmit?: (values: any) => void }) {
    const utilityStore = useUtilityStore();

    return (
        <FormContainer
            schema={{
                table: "user_integrations",
                columns: columns || [
                    {
                        name: "service",
                        // @ts-ignore
                        label: "Integration Type",
                        dataType: "text",
                        enumValues: ["notion", "github", "stripe"]
                    },
                    {
                        name: "token",
                        // @ts-ignore
                        label: "API Token",
                        dataType: "text",
                        description: "Enter your integration token (will be encrypted)"
                    },
                    {
                        name: "database_id",
                        // @ts-ignore
                        label: "Database ID",
                        dataType: "text"
                    },
                    {
                        name: "page_id",
                        // @ts-ignore
                        label: "Page ID",
                        dataType: "text"
                    },
                ]
            }}
            handleCancelClick={() => utilityStore.setModal({ open: false, content: null })}
            handleSubmit={(value) => {
                if (onSubmit) onSubmit(value);

                // encryptMutation.mutate(values) {
                //     const { encrypted_token, iv, auth_tag } = encryptToken(values.token);

                //     const { error } = await supabase
                //         .from("user_integrations")
                //         .insert({
                //             user_id: userId,
                //             service: values.service,
                //             encrypted_token,
                //             iv,
                //             auth_tag
                //         });

                //     if (error) throw new Error(error.message);
                // }
            }}
        />
    );
}