import { FriendsCrud } from "~/components/users/friends";

export default function FriendsPage() {
  return (
    <main className="flex gap-4 flex-col">
      <p>Os amigos que já racharam contas com você.</p>
      <FriendsCrud />
    </main>
  );
}
