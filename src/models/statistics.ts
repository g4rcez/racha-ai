import { Linq } from "linq-arrays";
import { Dict } from "~/lib/dict";
import { Orders } from "~/services/orders/orders.types";
import { User } from "~/store/friends.store";

export namespace Statistics {
  export const summary = (history: Orders.Shape[], _user: User) => {
    if (history.length === 0) return null;
    const result = history.reduce(
      (acc, el) => {
        const total = acc.total + el.total;
        const users = Dict.from("id", el.users);
        console.log({ total, users });
        // const ownTotal =
        //   users.get(user.id)!.result.totalWithCouvert + acc.ownTotal;
        return { ownTotal: 0, total: 0 };
      },
      { total: 0, ownTotal: 0 },
    );
    const places = new Linq(history).Select();
    return {
      places: places.length,
      total: result.total,
      ownTotal: result.total,
      economic: result.total - result.ownTotal,
    };
  };
}
