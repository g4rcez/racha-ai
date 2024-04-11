import { Linq } from "linq-arrays";
import { Dict } from "~/lib/dict";
import { Orders } from "~/services/orders/orders.types";
import { User } from "~/store/friends.store";

export namespace Statistics {
  export const summary = (history: Orders.Shape[], user: User) => {
    if (history.length === 0) return null;
    const result = history.reduce(
      (acc, el) => {
        const total = acc.total + Number(el.total);
        const users = Dict.from((x) => x.data.id, el.users);
        const data = users.get(user.id);
        if (!data) return acc;
        const ownTotal = Number(data.payment?.amount || 0);
        return { ownTotal: ownTotal + acc.ownTotal, total };
      },
      { total: 0, ownTotal: 0 },
    );
    const places = new Linq(history).Select();
    return {
      places: places.length,
      total: result.total,
      ownTotal: result.ownTotal,
      economic: result.total - result.ownTotal,
    };
  };
}
