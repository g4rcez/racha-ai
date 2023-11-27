import { UserForm } from "~/components/users/user-form";

export default function IndexPage() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center px-12 align-middle text-2xl font-medium">
            <UserForm />
        </div>
    );
}
