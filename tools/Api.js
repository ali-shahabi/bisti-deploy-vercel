import config from "./Globals.js";
const Api = {
  login: (body) => {
    return config.axiosHandle().post("v0/admin/login", body);
  },
  upload: (body) => {
    return config.axiosHandle().post("v0/file/upload", body);
  },
  getDashboardReports: (params) => {
    return config.axiosHandle().get("v0/admin/dashboard/report/number", params);
  },

  saveArtist: (body) => {
    return config.axiosHandle().post("v0/admin/artist/create", body);
  },
  artistList: (body) => {
    return config.axiosHandle().get("v0/admin/artist/list", body);
  },
  deleteArtist: (id) => {
    return config.axiosHandle().delete("v0/admin/artist/real-remove/" + id);
  },
  editArtist: (body) => {
    return config.axiosHandle().post("v0/admin/artist/update/" + body.id, body);
  },
  saveTrack: (body) => {
    return config.axiosHandle().post("v0/admin/music/create", body);
  },
  tracksList: (body) => {
    return config.axiosHandle().get("v0/admin/music/list", body);
  },

  deleteTrack: (id) => {
    return config.axiosHandle().delete("v0/admin/music/real-remove/" + id);
  },
  editTrack: (body) => {
    return config.axiosHandle().post("v0/admin/music/update/" + body.id, body);
  },
  saveAlbum: (body) => {
    return config.axiosHandle().post("v0/admin/album/create", body);
  },
  albumList: (body) => {
    return config.axiosHandle().get("v0/admin/album/list", body);
  },

  deleteAlbum: (id) => {
    return config.axiosHandle().delete("v0/admin/album/real-remove/" + id);
  },
  activeAlbum: (param) => {
    return config.axiosHandle().delete("v0/admin/album/deactive/" + param);
  },
  activeArtist: (param) => {
    return config.axiosHandle().delete("v0/admin/artist/deactive/" + param);
  },
  activeMusic: (param) => {
    return config.axiosHandle().delete("v0/admin/music/deactive/" + param);
  },
  editAlbum: (body) => {
    return config.axiosHandle().post("v0/admin/album/update/" + body.id, body);
  },
  categoryList: (body) => {
    return config.axiosHandle().get("v0/category/list", body);
  },
  deleteCategory: (id) => {
    return config.axiosHandle().delete("v0/admin/category/remove/" + id);
  },
  editCategory: (body) => {
    return config
      .axiosHandle()
      .post("v0/admin/category/update/" + body.id, body);
  },
  saveCategory: (body) => {
    return config.axiosHandle().post("v0/admin/category/create", body);
  },
  playlists: (body) => {
    return config.axiosHandle().get("v0/admin/playlist/list", body);
  },
  deletePLaylist: (id) => {
    return config.axiosHandle().delete("v0/admin/playlist/remove/" + id);
  },
  editPLaylist: (body) => {
    return config
      .axiosHandle()
      .post("v0/admin/playlist/update/" + body.id, body);
  },
  savePLaylist: (body) => {
    return config.axiosHandle().post("v0/admin/playlist/create", body);
  },
  playlistDetail: (id) => {
    return config
      .axiosHandle()
      .get("v0/playlist/list/details?playlistId=" + id);
  },
};
export default Api;
