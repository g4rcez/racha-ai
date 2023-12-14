import { Link } from "brouther";
import { link, links } from "~/router";

export default function IndexPage() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-l from-indigo-950 px-12 align-middle text-2xl font-medium">
            <Link
                href={link(links.app)}
                className="flex flex-col transition-all duration-500 link:text-main-bg link:underline"
            >
                <h1 className="text-7xl font-bold leading-relaxed tracking-wide">Divide aí</h1>
                <p className="-mt-2 text-lg">A melhor maneira de dividir sua conta com a galera</p>
            </Link>
        </div>
    );
}
