import { REVALIDATE_TIME, HOST } from "@/lib/constants/constants";

// ✅ helper to normalize any API response to array
function toArray(data, arrayKey) {
  if (Array.isArray(data)) return data
  if (arrayKey && Array.isArray(data?.[arrayKey])) return data[arrayKey]
  return []
}

export async function getStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/states`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok) {
      // ✅ single state lookup → return error object
      if (params.state_slug) {
        return { error: `Failed: ${res.status}`, status: res.status }
      }
      return []  // ✅ list lookup → return empty array
    }

    const data = await res.json();

    // ✅ single state → return object
    if (params.state_slug && !params.limit) return data

    // ✅ list → always return array
    return toArray(data, 'allStates')

  } catch (error) {
    console.error("getStates error:", error);
    return [];
  }
}

export async function getDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/districts`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok) {
      // ✅ single district lookup → return error object
      if (params.state_slug && params.district_slug) {
        return { error: `Failed: ${res.status}`, status: res.status }
      }
      return []  // ✅ list lookup → return empty array
    }

    const data = await res.json();

    // ✅ single district → return object
    if (params.state_slug && params.district_slug && !params.limit) return data

    // ✅ list → always return array
    return toArray(data, 'allDistricts')

  } catch (error) {
    console.error("getDistricts error:", error);
    return [];
  }
}

export async function getTehsils(params = {}) {
  try {
    const url = new URL(`${HOST}/api/tehsil`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok) {
      // ✅ single tehsil lookup → return error object
      if (params.state_slug && params.district_slug && params.block_slug) {
        return { error: `Failed: ${res.status}`, status: res.status }
      }
      return []  // ✅ list lookup → return empty array
    }

    const data = await res.json();

    // ✅ single tehsil → return object
    if (params.state_slug && params.district_slug && params.block_slug) return data

    // ✅ list → always return array
    return toArray(data, 'allTehsils')

  } catch (error) {
    console.error("getTehsils error:", error);
    return [];
  }
}

export async function getVillages(params = {}) {
  try {
    const url = new URL(`${HOST}/api/village`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok) {
      // ✅ single village lookup → return error object
      if (params.village_slug) {
        return { error: `Failed: ${res.status}`, status: res.status }
      }
      return []  // ✅ list → return empty array
    }

    const data = await res.json();

    // ✅ single village → return object
    if (params.village_slug) return data

    // ✅ list → always return array
    return toArray(data, 'allVillages')

  } catch (error) {
    console.error("getVillages error:", error);
    return [];
  }
}

// getContent stays same ✅
export async function getContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);
    url.searchParams.append("page_id", page_id.toLowerCase());
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!res.ok)
      return { error: `Failed: ${res.status}`, status: res.status };

    return await res.json();
  } catch (error) {
    console.error("getContent error:", error);
    return null;
  }
}

// saveContent stays same ✅
export async function saveContent(page_id, data = {}, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);

    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
      ...(params.tehsil_slug && { tehsil_slug: params.tehsil_slug }),
      ...(params.village_slug && { village_slug: params.village_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return { error: `Failed: ${res.status}`, status: res.status };

    return await res.json();
  } catch (error) {
    console.error("saveContent error:", error);
    return { error: "Unexpected error" };
  }
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
