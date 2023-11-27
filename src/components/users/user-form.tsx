import { Form } from "brouther";
import { PlusIcon } from "lucide-react";
import { Button } from "~/components/button";
import { Input } from "~/components/form/input";
import { useI18n } from "~/i18n";

export const UserForm = () => {
    const [i18n] = useI18n();
    return (
        <Form className="flex items-end gap-2">
            <Input required title={i18n.get("userInput")} placeholder={i18n.get("userInputPlaceholder")} name="name" />
            <Button size="small" rounded="circle">
                <PlusIcon />
            </Button>
        </Form>
    );
};
