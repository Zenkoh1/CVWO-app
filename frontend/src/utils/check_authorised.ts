import UserType from "../types/User.type";

/* Check if the user is authorised to edit/delete a question/answer */
function isAuthorised(poster_id: number | undefined, user_info: UserType) {
  if (user_info.id === poster_id || user_info.admin) {
    return true;
  } else {
    return false;
  }
}

export default isAuthorised;
