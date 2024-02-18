import { authMiddleware, endpoint, parseMessageError } from "~/lib/http";
import { User } from "~/services/user";

const notAuthorizedGroup = [
  { message: "Você não possui autorização ou o grupo não existe", path: [] },
];

export default endpoint({
  post: authMiddleware(async (req, res, session) => {
    const data = {
      email: req.body.email,
      groupId: req.query.id,
      owner: session.user.id,
    };
    const validation = User.newUserGroup.safeParse(data);
    if (!validation.success)
      return res.status(400).json(parseMessageError(validation.error.issues));
    const group = validation.data;
    const isOwner = await User.isGroupOwner(group.owner, group.groupId);
    if (!isOwner)
      return res.status(400).json(parseMessageError(notAuthorizedGroup));
    const newMember = await User.getByEmail(validation.data.email);
    if (newMember.isSuccess()) {
      const result = await User.addUserToGroup(
        newMember.success?.id,
        validation.data.groupId,
      );
      return result.isSuccess() ? res.status(204).end() : res.status(400).end();
    }
    return res.status(400).end();
  }),
});
