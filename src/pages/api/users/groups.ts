import { authMiddleware, endpoint, parseMessageError } from "~/lib/http";
import { User } from "~/services/user";

export default endpoint({
  post: authMiddleware(async (req, res, session) => {
    const validation = User.groupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(parseMessageError(validation.error.issues));
    }
    const createdGroup = await User.createGroup(
      validation.data,
      session.user?.id,
    );
    return res.json(createdGroup);
  }),
});
