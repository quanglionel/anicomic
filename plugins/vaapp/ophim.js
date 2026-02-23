/*
  VAAPP plugin built from TUTORIAL.md format.
  Source: OPhim public API.
*/

var OPHIM_BASE = "https://ophim1.com";
var DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

function safeJsonParse(input, fallback) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return fallback;
  }
}

function toJsonString(value, fallback) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return JSON.stringify(fallback);
  }
}

function normalizePoster(url) {
  if (!url) return "";
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
    return url;
  }
  return OPHIM_BASE + (url.charAt(0) === "/" ? "" : "/") + url;
}

function getManifest() {
  return toJsonString(
    {
      id: "ophim_movie",
      name: "OPhim Movie",
      version: "1.0.0",
      type: "MOVIE",
      layout: "HORIZONTAL",
      baseUrl: OPHIM_BASE,
      author: "anicomic",
    },
    {},
  );
}

function getHomeSections() {
  return toJsonString(
    [
      { slug: "phim-moi-cap-nhat", title: "Moi cap nhat", type: "list", path: "/v1/api/danh-sach/phim-moi-cap-nhat" },
      { slug: "phim-le", title: "Phim le", type: "list", path: "/v1/api/danh-sach/phim-le" },
      { slug: "phim-bo", title: "Phim bo", type: "list", path: "/v1/api/danh-sach/phim-bo" },
      { slug: "hoat-hinh", title: "Hoat hinh", type: "list", path: "/v1/api/danh-sach/hoat-hinh" }
    ],
    [],
  );
}

function getPrimaryCategories() {
  return toJsonString(
    [
      { slug: "hanh-dong", title: "Hanh dong" },
      { slug: "phieu-luu", title: "Phieu luu" },
      { slug: "vien-tuong", title: "Vien tuong" },
      { slug: "kinh-di", title: "Kinh di" },
      { slug: "lang-man", title: "Lang man" }
    ],
    [],
  );
}

function getFilterConfig() {
  return toJsonString(
    {
      sort: ["modified.time", "year", "_id"],
      type: ["single", "series", "hoathinh"],
      country: ["han-quoc", "my", "trung-quoc", "nhat-ban", "thai-lan"],
      year: ["2026", "2025", "2024", "2023", "2022"]
    },
    {},
  );
}

function getUrlList(slug, filtersJson) {
  var filters = safeJsonParse(filtersJson || "{}", {});
  var page = filters.page || 1;
  var sortField = filters.sortField || "modified.time";
  var sortType = filters.sortType || "desc";
  var category = filters.category || "";
  var country = filters.country || "";
  var year = filters.year || "";

  var url = OPHIM_BASE + "/v1/api/danh-sach/" + encodeURIComponent(slug || "phim-moi-cap-nhat");
  url += "?page=" + encodeURIComponent(page);
  url += "&sort_field=" + encodeURIComponent(sortField);
  url += "&sort_type=" + encodeURIComponent(sortType);
  if (category) url += "&category=" + encodeURIComponent(category);
  if (country) url += "&country=" + encodeURIComponent(country);
  if (year) url += "&year=" + encodeURIComponent(year);
  return url;
}

function getUrlSearch(keyword, filtersJson) {
  var filters = safeJsonParse(filtersJson || "{}", {});
  var page = filters.page || 1;
  var key = keyword || "";
  return (
    OPHIM_BASE +
    "/v1/api/tim-kiem?keyword=" +
    encodeURIComponent(key) +
    "&page=" +
    encodeURIComponent(page)
  );
}

function getUrlDetail(slug) {
  return OPHIM_BASE + "/phim/" + encodeURIComponent(slug || "");
}

function getUrlCategories() {
  return OPHIM_BASE + "/v1/api/the-loai";
}

function getUrlCountries() {
  return OPHIM_BASE + "/v1/api/quoc-gia";
}

function getUrlYears() {
  return OPHIM_BASE + "/v1/api/nam-phat-hanh";
}

function mapListItem(item) {
  return {
    id: item.slug || item._id || "",
    title: item.name || item.origin_name || "",
    posterUrl: normalizePoster(item.poster_url),
    backdropUrl: normalizePoster(item.thumb_url || item.poster_url),
    year: item.year || "",
  };
}

function parseListResponse(apiResponseJson) {
  try {
    var data = safeJsonParse(apiResponseJson, {});
    var items = [];

    if (data && data.data && data.data.items && data.data.items.map) {
      items = data.data.items.map(mapListItem);
    }

    return toJsonString({ items: items }, { items: [] });
  } catch (e) {
    return toJsonString({ items: [] }, { items: [] });
  }
}

function parseSearchResponse(apiResponseJson) {
  return parseListResponse(apiResponseJson);
}

function parseMovieDetail(apiResponseJson) {
  try {
    var data = safeJsonParse(apiResponseJson, {});
    var movie = data && data.movie ? data.movie : {};
    var episodes = data && data.episodes && data.episodes.map ? data.episodes : [];

    var episodeGroups = episodes.map(function (group) {
      var serverName = group.server_name || "default";
      var items = (group.server_data || []).map(function (ep) {
        return {
          id: ep.slug || ep.filename || ep.link_m3u8 || ep.link_embed || "",
          title: ep.name || ep.slug || "Episode",
          slug: ep.slug || "",
          server: serverName,
          streamUrl: ep.link_m3u8 || ep.link_embed || "",
        };
      });

      return {
        server: serverName,
        items: items,
      };
    });

    return toJsonString(
      {
        id: movie.slug || "",
        title: movie.name || "",
        originalTitle: movie.origin_name || "",
        posterUrl: normalizePoster(movie.poster_url),
        backdropUrl: normalizePoster(movie.thumb_url || movie.poster_url),
        year: movie.year || "",
        quality: movie.quality || "",
        language: movie.lang || "",
        duration: movie.time || "",
        actor: movie.actor || [],
        director: movie.director || [],
        category: movie.category || [],
        country: movie.country || [],
        content: movie.content || "",
        episodes: episodeGroups,
      },
      {
        id: "",
        title: "",
        episodes: [],
      },
    );
  } catch (e) {
    return toJsonString(
      {
        id: "",
        title: "",
        episodes: [],
      },
      {
        id: "",
        title: "",
        episodes: [],
      },
    );
  }
}

function parseDetailResponse(apiResponseJson) {
  try {
    var data = safeJsonParse(apiResponseJson, {});
    var url = data.streamUrl || data.url || "";

    return toJsonString(
      {
        streamUrl: url,
        headers: {
          "User-Agent": DEFAULT_UA,
          Referer: OPHIM_BASE + "/",
        },
      },
      {
        streamUrl: "",
        headers: {},
      },
    );
  } catch (e) {
    return toJsonString(
      {
        streamUrl: "",
        headers: {},
      },
      {
        streamUrl: "",
        headers: {},
      },
    );
  }
}
