import { ThemeToggle } from "~/store/theme";

export default function IndexPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center align-middle text-2xl font-medium">
            <ThemeToggle />
        </div>
    );
}