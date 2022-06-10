import request_mock from "@/utils/request_mock";

const state = {
  list: {},
};
const actions = {
  async getdata({ commit }) {
    const result = await request_mock.get("/home/list");
    if (result.code == 20000) {
      commit("GETDATA", result.data);
    }
  },
};
const mutations = {
  GETDATA(state, list) {
    state.list = list;
  },
};
const getters = {};
export default {
  state,
  actions,
  mutations,
  getters,
};
