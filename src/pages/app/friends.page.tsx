import { SectionTitle } from "~/components/typography";
import { FriendsCrud } from "~/components/users/friends";

export default function FriendsPage() {
  return (
    <main className="flex gap-4 flex-col">
      <SectionTitle title="Meus amigos">
        Sua lista de amigos que já racharam ou vão rachar contas com você.
      </SectionTitle>
      <FriendsCrud />
    </main>
  );
}
