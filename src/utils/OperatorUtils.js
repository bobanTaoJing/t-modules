import store from "../store/index";

const OperatorUtils = {
  getPermsData() {
    return store.getters.userInfo.perm
  },
}

export default OperatorUtils

