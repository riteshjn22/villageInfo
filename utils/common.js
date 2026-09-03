import {
  REVALIDATE_TIME,
  HOST,
  VERCEL_BYPASS_HEADERS,
} from "@/lib/constants/constants";

export async function getStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/states`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    // deepak start - old code (replaced below):
    // const res = await fetch(url.toString(), {
    //   next: { revalidate: REVALIDATE_TIME }, // revalidate every 24 hours
    // });
    // deepak end - old code

    // deepak start - new code: add cache tags so specific states can be revalidated on-demand
    const stateTag = params.state_slug ? `state-${params.state_slug}` : null;
    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["states", stateTag].filter(Boolean),
      },
    });
    // deepak end - new code

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getStates error:", error);
    return [];
  }
}

export async function getDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/districts`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    // deepak start - old code (replaced below):
    // const res = await fetch(url.toString(), {
    //   next: { revalidate: REVALIDATE_TIME }, // revalidate every 24 hours
    // });
    // deepak end - old code

    // deepak start - new code: add cache tags so specific districts can be revalidated on-demand
    const districtTags = [
      "districts",
      params.state_slug ? `state-${params.state_slug}` : null,
      params.district_slug ? `district-${params.district_slug}` : null,
    ].filter(Boolean);
    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });
    // deepak end - new code

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allDistricts array exists, return it (multiple districts)
    // Otherwise return the single district object
    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getDistricts error:", error);
    return [];
  }
}

export async function getTehsils(params = {}) {
  try {
    const url = new URL(`${HOST}/api/tehsil`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    // deepak start - old code (replaced below):
    // const res = await fetch(url.toString(), {
    //   next: { revalidate: REVALIDATE_TIME }, // revalidate every 24 hours
    // });
    // deepak end - old code

    // deepak start - new code: add cache tags so specific tehsils can be revalidated on-demand
    const tehsilTags = [
      "tehsils",
      params.state_slug ? `state-${params.state_slug}` : null,
      params.district_slug ? `district-${params.district_slug}` : null,
      params.block_slug ? `tehsil-${params.block_slug}` : null,
    ].filter(Boolean);
    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: tehsilTags },
    });
    // deepak end - new code

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allTehsils array exists, return it (multiple tehsils)
    // Otherwise return the single tehsil object
    if (data?.allTehsils) {
      return data.allTehsils;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getTehsils error:", error);
    return [];
  }
}

export async function getVillages(params = {}) {
  try {
    const url = new URL(`${HOST}/api/village`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    // deepak start - old code (replaced below):
    // const res = await fetch(url.toString(), {
    //   next: { revalidate: REVALIDATE_TIME }, // revalidate every 24 hours
    // });
    // deepak end - old code

    // deepak start - new code: add cache tags so specific villages can be revalidated on-demand
    const villageTags = [
      "villages",
      params.state_slug ? `state-${params.state_slug}` : null,
      params.district_slug ? `district-${params.district_slug}` : null,
      params.block_slug ? `tehsil-${params.block_slug}` : null,
      params.village_slug ? `village-${params.village_slug}` : null,
    ].filter(Boolean);
    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: villageTags },
    });
    // deepak end - new code

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allVillages array exists, return it (multiple villages)
    // Otherwise return the single village object
    if (data?.allVillages) {
      return data.allVillages;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getVillages error:", error);
    return [];
  }
}

// GET /api/content?page_id=home
// GET /api/content?page_id=home
export async function getContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    // Append any slugs or extra params (state_slug, district_slug, tehsil_slug, village_slug)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    // deepak start - old code (replaced below):
    // const res = await fetch(url.toString(), {
    //   next: { revalidate: REVALIDATE_TIME },
    // });
    // deepak end - old code

    // deepak start - new code: add cache tags so specific content pages can be revalidated on-demand
    const contentTags = [
      "content",
      `content-${page_id.toLowerCase()}`,
      params.state_slug ? `state-${params.state_slug}` : null,
      params.district_slug ? `district-${params.district_slug}` : null,
    ].filter(Boolean);
    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });
    // deepak end - new code

    if (!res.ok)
      return {
        error: `Failed to fetch content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getContent error:", error);
    return null;
  }
}

// POST /api/content
export async function saveContent(page_id, data = {}, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slug based on page_id or passed params
    // Priority: explicit params > page_id inference
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
      ...(params.tehsil_slug && { tehsil_slug: params.tehsil_slug }),
      ...(params.village_slug && { village_slug: params.village_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}

// Formate Date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// deepak start - new code: Hindu Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/hindu-population/* endpoints, kept separate from the main dataset.
export async function getHinduPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/hindu-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `hindu-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["hindu-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch hindu population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getHinduPopulationStates error:", error);
    return [];
  }
}

export async function getHinduPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/hindu-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "hindu-population-districts",
      params.state_slug ? `hindu-population-state-${params.state_slug}` : null,
      params.state_slug && params.district_slug
        ? `hindu-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch hindu population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getHinduPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Hindu Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/hindu-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getHinduPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/hindu-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "hindu-population-content",
      `hindu-population-content-${page_id.toLowerCase()}`,
      params.state_slug ? `hindu-population-state-${params.state_slug}` : null,
      params.district_slug
        ? `hindu-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch hindu population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getHinduPopulationContent error:", error);
    return null;
  }
}

// POST /api/hindu-population/content
export async function saveHinduPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/hindu-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save hindu population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveHinduPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code

// deepak start - new code: Muslim Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/muslim-population/* endpoints, kept separate from the main dataset.
export async function getMuslimPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/muslim-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `muslim-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["muslim-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch muslim population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getMuslimPopulationStates error:", error);
    return [];
  }
}

export async function getMuslimPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/muslim-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "muslim-population-districts",
      params.state_slug ? `muslim-population-state-${params.state_slug}` : null,
      params.state_slug && params.district_slug
        ? `muslim-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch muslim population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getMuslimPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Muslim Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/muslim-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getMuslimPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/muslim-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "muslim-population-content",
      `muslim-population-content-${page_id.toLowerCase()}`,
      params.state_slug ? `muslim-population-state-${params.state_slug}` : null,
      params.district_slug
        ? `muslim-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch muslim population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getMuslimPopulationContent error:", error);
    return null;
  }
}

// POST /api/muslim-population/content
export async function saveMuslimPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/muslim-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save muslim population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveMuslimPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code

// deepak start - new code: Christian Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/christian-population/* endpoints, kept separate from the main dataset.
export async function getChristianPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/christian-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `christian-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["christian-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch christian population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getChristianPopulationStates error:", error);
    return [];
  }
}

export async function getChristianPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/christian-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "christian-population-districts",
      params.state_slug
        ? `christian-population-state-${params.state_slug}`
        : null,
      params.state_slug && params.district_slug
        ? `christian-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch christian population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getChristianPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Christian Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/christian-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getChristianPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/christian-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "christian-population-content",
      `christian-population-content-${page_id.toLowerCase()}`,
      params.state_slug
        ? `christian-population-state-${params.state_slug}`
        : null,
      params.district_slug
        ? `christian-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch christian population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getChristianPopulationContent error:", error);
    return null;
  }
}

// POST /api/christian-population/content
export async function saveChristianPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/christian-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save christian population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveChristianPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code

// deepak start - new code: Sikh Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/sikh-population/* endpoints, kept separate from the main dataset.
export async function getSikhPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/sikh-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `sikh-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["sikh-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch sikh population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getSikhPopulationStates error:", error);
    return [];
  }
}

export async function getSikhPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/sikh-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "sikh-population-districts",
      params.state_slug ? `sikh-population-state-${params.state_slug}` : null,
      params.state_slug && params.district_slug
        ? `sikh-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch sikh population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getSikhPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Sikh Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/sikh-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getSikhPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/sikh-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "sikh-population-content",
      `sikh-population-content-${page_id.toLowerCase()}`,
      params.state_slug ? `sikh-population-state-${params.state_slug}` : null,
      params.district_slug
        ? `sikh-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch sikh population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getSikhPopulationContent error:", error);
    return null;
  }
}

// POST /api/sikh-population/content
export async function saveSikhPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/sikh-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save sikh population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveSikhPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code

// deepak start - new code: Buddhist Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/buddhist-population/* endpoints, kept separate from the main dataset.
export async function getBuddhistPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/buddhist-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `buddhist-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["buddhist-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch buddhist population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getBuddhistPopulationStates error:", error);
    return [];
  }
}

export async function getBuddhistPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/buddhist-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "buddhist-population-districts",
      params.state_slug
        ? `buddhist-population-state-${params.state_slug}`
        : null,
      params.state_slug && params.district_slug
        ? `buddhist-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch buddhist population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getBuddhistPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Buddhist Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/buddhist-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getBuddhistPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/buddhist-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "buddhist-population-content",
      `buddhist-population-content-${page_id.toLowerCase()}`,
      params.state_slug
        ? `buddhist-population-state-${params.state_slug}`
        : null,
      params.district_slug
        ? `buddhist-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch buddhist population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getBuddhistPopulationContent error:", error);
    return null;
  }
}

// POST /api/buddhist-population/content
export async function saveBuddhistPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/buddhist-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save buddhist population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveBuddhistPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code

// deepak start - new code: Jain Population feature helpers
// Mirror getStates/getDistricts above but point at the dedicated
// /api/jain-population/* endpoints, kept separate from the main dataset.
export async function getJainPopulationStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/jain-population/states`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const stateTag = params.state_slug
      ? `jain-population-state-${params.state_slug}`
      : null;

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: {
        revalidate: REVALIDATE_TIME,
        tags: ["jain-population-states", stateTag].filter(Boolean),
      },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch jain population states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getJainPopulationStates error:", error);
    return [];
  }
}

export async function getJainPopulationDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/jain-population/districts`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const districtTags = [
      "jain-population-districts",
      params.state_slug ? `jain-population-state-${params.state_slug}` : null,
      params.state_slug && params.district_slug
        ? `jain-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: districtTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch jain population districts: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getJainPopulationDistricts error:", error);
    return [];
  }
}
// deepak end - new code

// deepak start - new code: Jain Population feature content helpers
// Mirror getContent/saveContent above but point at the dedicated
// /api/jain-population/content endpoint, kept separate from the main
// site's Content collection. Scoped to home/state/district only.
export async function getJainPopulationContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/jain-population/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const contentTags = [
      "jain-population-content",
      `jain-population-content-${page_id.toLowerCase()}`,
      params.state_slug ? `jain-population-state-${params.state_slug}` : null,
      params.district_slug
        ? `jain-population-district-${params.district_slug}`
        : null,
    ].filter(Boolean);

    const res = await fetch(url.toString(), {
      headers: VERCEL_BYPASS_HEADERS,
      next: { revalidate: REVALIDATE_TIME, tags: contentTags },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch jain population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getJainPopulationContent error:", error);
    return null;
  }
}

// POST /api/jain-population/content
export async function saveJainPopulationContent(
  page_id,
  data = {},
  params = {},
) {
  try {
    const url = new URL(`${HOST}/api/jain-population/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slugs based on explicit params
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...VERCEL_BYPASS_HEADERS },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save jain population content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveJainPopulationContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}
// deepak end - new code
