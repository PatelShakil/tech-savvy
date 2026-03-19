/**
 * CdnUploadService.ts
 * Web equivalent of the Android CdnUploadService.
 * Uploads files to the TechSavvy CDN via multipart/form-data POST.
 *
 * CDN API contract:
 *   POST https://cdn.techsavvysolution.in/api/upload.php
 *   Authorization: Bearer <token>
 *   Body: multipart/form-data, field name = "file"
 *
 *   Response: { success: boolean, url: string, message?: string }
 */

const CDN_URL = "https://cdn.techsavvysolution.in/api/upload.php";
const API_TOKEN = "MY_SECURE_API_TOKEN";

export interface CdnUploadResult {
    url: string;
}

/**
 * Uploads a single File to the TechSavvy CDN.
 * @param file  The File object to upload (from an <input type="file"> or drag-drop)
 * @param onProgress  Optional callback receiving a 0–100 progress value.
 *                    Note: XMLHttpRequest is used when onProgress is provided,
 *                    otherwise fetch is used for simplicity.
 * @returns The CDN URL of the uploaded file
 * @throws Error if the upload fails or the server returns success=false
 */
export async function uploadFileToCdn(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    // If a progress callback is provided use XHR (fetch doesn't expose upload progress)
    if (onProgress) {
        return uploadWithProgress(formData, onProgress);
    }

    const response = await fetch(CDN_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            // Do NOT set Content-Type manually — browser sets it with the correct boundary
        },
        body: formData,
    });

    const json = await response.json();
    if (json.success) {
        return json.url as string;
    }
    throw new Error(`CDN upload failed: ${json.message ?? "Unknown error"}`);
}

/**
 * Uploads multiple files sequentially and returns all CDN URLs.
 * Throws on the first failure.
 */
export async function uploadFilesToCdn(
    files: File[],
    onProgress?: (fileIndex: number, percent: number) => void
): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToCdn(
            files[i],
            onProgress ? (pct) => onProgress(i, pct) : undefined
        );
        urls.push(url);
    }
    return urls;
}

// ─── XHR-based upload with progress reporting ────────────────────────────────
function uploadWithProgress(
    formData: FormData,
    onProgress: (percent: number) => void
): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        });

        xhr.addEventListener("load", () => {
            try {
                const json = JSON.parse(xhr.responseText);
                if (json.success) {
                    resolve(json.url as string);
                } else {
                    reject(new Error(`CDN upload failed: ${json.message ?? "Unknown error"}`));
                }
            } catch {
                reject(new Error(`CDN returned invalid JSON (status ${xhr.status})`));
            }
        });

        xhr.addEventListener("error", () =>
            reject(new Error("CDN upload network error"))
        );
        xhr.addEventListener("abort", () =>
            reject(new Error("CDN upload aborted"))
        );

        xhr.open("POST", CDN_URL);
        xhr.setRequestHeader("Authorization", `Bearer ${API_TOKEN}`);
        xhr.send(formData);
    });
}

/**
 * Deletes a file from the CDN by its URL.
 * Calls DELETE on the CDN endpoint with the file URL in the request body.
 *
 * Note: If the CDN API doesn't expose a delete endpoint yet, this is a no-op
 * and simply logs a warning. Remove the early-return once the endpoint is live.
 */
export async function deleteFileFromCdn(fileUrl: string): Promise<void> {
    // TODO: Replace this with the real CDN delete endpoint when available.
    console.warn("[CdnUploadService] Delete not yet implemented on CDN. File URL:", fileUrl);
    return;

    // Example implementation once a delete endpoint exists:
    // const response = await fetch("https://cdn.techsavvysolution.in/api/delete.php", {
    //     method: "DELETE",
    //     headers: {
    //         Authorization: `Bearer ${API_TOKEN}`,
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ url: fileUrl }),
    // });
    // const json = await response.json();
    // if (!json.success) throw new Error(`CDN delete failed: ${json.message}`);
}
