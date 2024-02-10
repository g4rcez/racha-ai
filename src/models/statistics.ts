import { Linq } from "linq-arrays";
import { User } from "~/store/friends.store";
import { HistoryItem } from "~/store/history.store";

export namespace Statistics {
  export const summary = (history: HistoryItem[], user: User) => {
    if (history.length === 0) return null;
    const result = history.reduce(
      (acc, el) => {
        const total = acc.total + el.total;
        const ownTotal =
          el.users.get(user.id)!.result.totalWithCouvert + acc.ownTotal;
        return { ownTotal, total };
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
