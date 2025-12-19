export function setupFileUpload(container, onFileUpload) {
  const dropZone = container.querySelector("#drop-zone");
  const fileInput = container.querySelector("#excelFile");
  const uploadSection = container.querySelector(".upload-section");

  container.addEventListener("click", (e) => {
    const clickedOnImage =
      e.target.closest("img") ||
      e.target.closest("#excel-template") ||
      e.target.closest("#plot-template");

    if (!clickedOnImage) {
      fileInput.click();
    }
  });
  fileInput.setAttribute("accept", ".xlsx,.xls,.json");
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadSection.style.display = "none";
    await onFileUpload(file);
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  container.addEventListener("dragleave", (e) => {
    if (!container.contains(e.relatedTarget)) {
      dropZone.classList.remove("dragover");
    }
  });

  container.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];

    uploadSection.style.display = "none";
    await onFileUpload(file);
  });
}
