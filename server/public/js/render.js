import * as pdfjsLib from '/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.mjs';


// ============================================================
// ELEMENTS
// ============================================================

const pdfViewer = document.getElementById('pdf-viewer');
const pdfUrl = pdfViewer.dataset.pdfUrl;

const readerWorkspace = document.getElementById('reader-workspace');

const currentPageInput = document.getElementById('current-page-input');
const totalPages = document.getElementById('total-pages');

const previousPageBtn = document.getElementById('previous-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');

const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomLevel = document.getElementById('zoom-level');

const fitWidthBtn = document.getElementById('fit-width-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');


// Sidebar
const thumbnailList = document.getElementById('thumbnail-list');
const thumbnailsTabBtn = document.getElementById('thumbnails-tab-btn');
const contentsTabBtn = document.getElementById('contents-tab-btn');


// Mobile controls
const mobilePreviousPageBtn = document.getElementById(
    'mobile-previous-page-btn'
);

const mobileNextPageBtn = document.getElementById(
    'mobile-next-page-btn'
);

const mobileCurrentPage = document.getElementById(
    'mobile-current-page'
);

const mobileTotalPages = document.getElementById(
    'mobile-total-pages'
);

const mobileZoomInBtn = document.getElementById(
    'mobile-zoom-in-btn'
);

const mobileZoomOutBtn = document.getElementById(
    'mobile-zoom-out-btn'
);

const mobileZoomLevel = document.getElementById(
    'mobile-zoom-level'
);


// ============================================================
// READER STATE
// ============================================================

let currentPage = 1;
let currentScale = 1;

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const ZOOM_STEP = 0.25;


// Used so old rendering jobs do not interfere after zooming
let renderGeneration = 0;


// ============================================================
// LOAD PDF
// ============================================================

const pdfDocument = await pdfjsLib.getDocument({
    url: pdfUrl
}).promise;


// Real total page count
totalPages.textContent = pdfDocument.numPages;

if (mobileTotalPages) {
    mobileTotalPages.textContent = pdfDocument.numPages;
}

currentPageInput.max = pdfDocument.numPages;


// ============================================================
// GET BASE PAGE SIZE
// ============================================================

const firstPage = await pdfDocument.getPage(1);

const baseViewport = firstPage.getViewport({
    scale: 1
});


// ============================================================
// CREATE LIGHTWEIGHT PAGE PLACEHOLDERS
// ============================================================

for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber++
) {

    const pageContainer = document.createElement('div');

    pageContainer.classList.add('pdf-page-container');

    pageContainer.dataset.pageNumber = pageNumber;

    pageContainer.style.width =
        `${baseViewport.width * currentScale}px`;

    pageContainer.style.height =
        `${baseViewport.height * currentScale}px`;

    pdfViewer.appendChild(pageContainer);
}


const pageContainers = pdfViewer.querySelectorAll(
    '.pdf-page-container'
);


// ============================================================
// GET PAGE CONTAINER
// ============================================================

function getPageContainer(pageNumber) {

    return pdfViewer.querySelector(
        `.pdf-page-container[data-page-number="${pageNumber}"]`
    );
}


// ============================================================
// RENDER ONE PDF PAGE
// ============================================================

async function renderPage(pageNumber, pageContainer) {

    const generation = renderGeneration;

    const renderKey =
        `${generation}-${currentScale}`;

    // Already rendered at this zoom level
    if (pageContainer.dataset.renderedKey === renderKey) {
        return;
    }

    // Already being rendered
    if (pageContainer.dataset.renderingKey === renderKey) {
        return;
    }

    pageContainer.dataset.renderingKey = renderKey;

    try {

        const page = await pdfDocument.getPage(pageNumber);

        const viewport = page.getViewport({
            scale: currentScale
        });


        // Zoom may have changed while page was loading
        if (generation !== renderGeneration) {
            return;
        }


        const canvas = document.createElement('canvas');

        canvas.dataset.pageNumber = pageNumber;

        canvas.width = viewport.width;
        canvas.height = viewport.height;


        // Give this placeholder the exact size of its real page
        pageContainer.style.width = `${viewport.width}px`;
        pageContainer.style.height = `${viewport.height}px`;


        // Remove an older canvas if this page was rendered before
        pageContainer.replaceChildren(canvas);


        await page.render({
            canvas: canvas,
            viewport: viewport
        }).promise;


        // Ignore old rendering after zoom change
        if (generation !== renderGeneration) {
            return;
        }


        pageContainer.dataset.renderedKey = renderKey;

    } catch (err) {

        console.error(
            `Failed to render page ${pageNumber}:`,
            err
        );

    } finally {

        if (
            pageContainer.dataset.renderingKey === renderKey
        ) {
            delete pageContainer.dataset.renderingKey;
        }
    }
}


// ============================================================
// CURRENT PAGE
// ============================================================

function setCurrentPage(pageNumber) {

    currentPage = pageNumber;

    currentPageInput.value = pageNumber;

    if (mobileCurrentPage) {
        mobileCurrentPage.textContent = pageNumber;
    }


    // Highlight active thumbnail
    const oldActiveThumbnail =
        thumbnailList.querySelector(
            '.thumbnail-item-active'
        );

    if (oldActiveThumbnail) {
        oldActiveThumbnail.classList.remove(
            'thumbnail-item-active'
        );
    }


    const newActiveThumbnail =
        thumbnailList.querySelector(
            `[data-thumbnail-page="${pageNumber}"]`
        );

    if (newActiveThumbnail) {
        newActiveThumbnail.classList.add(
            'thumbnail-item-active'
        );
    }


    previousPageBtn.disabled = pageNumber <= 1;

    nextPageBtn.disabled =
        pageNumber >= pdfDocument.numPages;


    if (mobilePreviousPageBtn) {
        mobilePreviousPageBtn.disabled = pageNumber <= 1;
    }

    if (mobileNextPageBtn) {
        mobileNextPageBtn.disabled =
            pageNumber >= pdfDocument.numPages;
    }
}


// ============================================================
// SCROLL TO PAGE
// ============================================================

function scrollToPage(pageNumber, smooth = true) {

    if (
        pageNumber < 1 ||
        pageNumber > pdfDocument.numPages
    ) {
        return;
    }

    const pageContainer =
        getPageContainer(pageNumber);

    if (!pageContainer) {
        return;
    }


    // Make sure a directly requested page starts rendering
    renderPage(pageNumber, pageContainer);


    pageContainer.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
    });
}


// ============================================================
// LAZY PAGE RENDERING
// ============================================================

// This observer renders pages when they get NEAR the viewport.
// rootMargin means pages start rendering before the user reaches them.

const renderObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            const pageNumber = Number(
                entry.target.dataset.pageNumber
            );

            renderPage(
                pageNumber,
                entry.target
            );
        });

    },
    {
        root: readerWorkspace,

        // Preload pages slightly above/below viewport
        rootMargin: '800px 0px',

        threshold: 0.01
    }
);


pageContainers.forEach((pageContainer) => {
    renderObserver.observe(pageContainer);
});


// ============================================================
// DETECT CURRENT VISIBLE PAGE
// ============================================================

const visiblePages = new Map();


const currentPageObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            const pageNumber = Number(
                entry.target.dataset.pageNumber
            );


            if (entry.isIntersecting) {

                visiblePages.set(
                    pageNumber,
                    entry.intersectionRatio
                );

            } else {

                visiblePages.delete(pageNumber);
            }
        });


        let bestPage = currentPage;
        let bestVisibility = -1;


        for (
            const [pageNumber, visibility]
            of visiblePages
        ) {

            if (visibility > bestVisibility) {

                bestVisibility = visibility;
                bestPage = pageNumber;
            }
        }


        if (bestVisibility >= 0) {
            setCurrentPage(bestPage);
        }

    },
    {
        root: readerWorkspace,

        threshold: [
            0,
            0.1,
            0.25,
            0.5,
            0.75,
            1
        ]
    }
);


pageContainers.forEach((pageContainer) => {
    currentPageObserver.observe(pageContainer);
});


// ============================================================
// NEXT / PREVIOUS
// ============================================================

function goToNextPage() {

    if (currentPage >= pdfDocument.numPages) {
        return;
    }

    scrollToPage(currentPage + 1);
}


function goToPreviousPage() {

    if (currentPage <= 1) {
        return;
    }

    scrollToPage(currentPage - 1);
}


nextPageBtn.addEventListener(
    'click',
    goToNextPage
);


previousPageBtn.addEventListener(
    'click',
    goToPreviousPage
);


// Mobile
if (mobileNextPageBtn) {

    mobileNextPageBtn.addEventListener(
        'click',
        goToNextPage
    );
}


if (mobilePreviousPageBtn) {

    mobilePreviousPageBtn.addEventListener(
        'click',
        goToPreviousPage
    );
}


// ============================================================
// TYPE PAGE NUMBER AND JUMP
// ============================================================

currentPageInput.addEventListener('change', () => {

    const pageNumber = Number(
        currentPageInput.value
    );


    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > pdfDocument.numPages
    ) {

        currentPageInput.value = currentPage;
        return;
    }


    scrollToPage(pageNumber);
});


// ============================================================
// ZOOM UI
// ============================================================

function updateZoomDisplay() {

    const percentage =
        `${Math.round(currentScale * 100)}%`;

    zoomLevel.textContent = percentage;


    if (mobileZoomLevel) {
        mobileZoomLevel.textContent = percentage;
    }
}


// ============================================================
// CHANGE ZOOM
// ============================================================

async function setZoom(newScale) {

    newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, newScale)
    );


    newScale =
        Math.round(newScale * 100) / 100;


    if (newScale === currentScale) {
        return;
    }


    currentScale = newScale;

    renderGeneration++;


    updateZoomDisplay();


    // Clear rendered page canvases.
    // They will be lazily re-rendered at the new scale.

    pageContainers.forEach((pageContainer) => {

        pageContainer.replaceChildren();

        delete pageContainer.dataset.renderedKey;
        delete pageContainer.dataset.renderingKey;


        pageContainer.style.width =
            `${baseViewport.width * currentScale}px`;

        pageContainer.style.height =
            `${baseViewport.height * currentScale}px`;
    });


    const currentContainer =
        getPageContainer(currentPage);


    // Immediately redraw the page the user is reading
    await renderPage(
        currentPage,
        currentContainer
    );


    // Keep user on same page after zoom
    currentContainer.scrollIntoView({
        behavior: 'auto',
        block: 'start'
    });
}


// ============================================================
// ZOOM IN / OUT
// ============================================================

function zoomIn() {

    setZoom(
        currentScale + ZOOM_STEP
    );
}


function zoomOut() {

    setZoom(
        currentScale - ZOOM_STEP
    );
}


zoomInBtn.addEventListener(
    'click',
    zoomIn
);


zoomOutBtn.addEventListener(
    'click',
    zoomOut
);


// Mobile zoom
if (mobileZoomInBtn) {

    mobileZoomInBtn.addEventListener(
        'click',
        zoomIn
    );
}


if (mobileZoomOutBtn) {

    mobileZoomOutBtn.addEventListener(
        'click',
        zoomOut
    );
}


// ============================================================
// FIT WIDTH
// ============================================================

fitWidthBtn.addEventListener('click', () => {

    const availableWidth =
        readerWorkspace.clientWidth - 40;


    const scale =
        availableWidth / baseViewport.width;


    setZoom(scale);
});


// ============================================================
// FULLSCREEN
// ============================================================

fullscreenBtn.addEventListener('click', async () => {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        } else {

            await document.exitFullscreen();
        }

    } catch (err) {

        console.error(
            'Fullscreen failed:',
            err
        );
    }
});


document.addEventListener(
    'fullscreenchange',
    () => {

        if (document.fullscreenElement) {

            fullscreenBtn.title =
                'Exit fullscreen';

            fullscreenBtn.setAttribute(
                'aria-label',
                'Exit fullscreen'
            );

        } else {

            fullscreenBtn.title =
                'Enter fullscreen';

            fullscreenBtn.setAttribute(
                'aria-label',
                'Enter fullscreen'
            );
        }
    }
);


// ============================================================
// THUMBNAILS
// ============================================================

// Remove the four fake thumbnail examples from the HTML
thumbnailList.replaceChildren();


async function renderThumbnail(
    pageNumber,
    previewContainer
) {

    if (previewContainer.dataset.rendered === 'true') {
        return;
    }


    previewContainer.dataset.rendered = 'true';


    try {

        const page =
            await pdfDocument.getPage(pageNumber);


        const viewport =
            page.getViewport({
                scale: 0.16
            });


        const canvas =
            document.createElement('canvas');


        canvas.width = viewport.width;
        canvas.height = viewport.height;

        canvas.classList.add(
            'thumbnail-canvas'
        );


        previewContainer.replaceChildren(
            canvas
        );


        await page.render({
            canvas: canvas,
            viewport: viewport
        }).promise;

    } catch (err) {

        console.error(
            `Thumbnail ${pageNumber} failed:`,
            err
        );
    }
}


const thumbnailFragment =
    document.createDocumentFragment();


for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber++
) {

    const button =
        document.createElement('button');


    button.type = 'button';

    button.classList.add(
        'thumbnail-item'
    );


    button.dataset.thumbnailPage =
        pageNumber;


    button.setAttribute(
        'aria-label',
        `Go to page ${pageNumber}`
    );


    const preview =
        document.createElement('div');


    preview.classList.add(
        'thumbnail-paper'
    );


    preview.dataset.thumbnailPreview =
        pageNumber;


    const number =
        document.createElement('span');


    number.classList.add(
        'thumbnail-page-number'
    );


    number.textContent = pageNumber;


    button.append(
        preview,
        number
    );


    button.addEventListener(
        'click',
        () => {

            scrollToPage(pageNumber);
        }
    );


    thumbnailFragment.appendChild(button);
}


thumbnailList.appendChild(
    thumbnailFragment
);


// Highlight first thumbnail initially
const firstThumbnail =
    thumbnailList.querySelector(
        '[data-thumbnail-page="1"]'
    );

if (firstThumbnail) {

    firstThumbnail.classList.add(
        'thumbnail-item-active'
    );
}


// Lazy thumbnail rendering
const thumbnailObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                const pageNumber =
                    Number(
                        entry.target.dataset.thumbnailPage
                    );


                const preview =
                    entry.target.querySelector(
                        '.thumbnail-paper'
                    );


                renderThumbnail(
                    pageNumber,
                    preview
                );
            });

        },
        {
            root: thumbnailList,
            rootMargin: '300px 0px',
            threshold: 0.01
        }
    );


thumbnailList
    .querySelectorAll('.thumbnail-item')
    .forEach((thumbnail) => {

        thumbnailObserver.observe(
            thumbnail
        );
    });


// ============================================================
// CONTENTS / PDF OUTLINE
// ============================================================

const contentsList =
    document.createElement('div');


contentsList.id = 'contents-list';
contentsList.classList.add('contents-list');
contentsList.hidden = true;


thumbnailList.after(contentsList);


let contentsLoaded = false;


// Find the PDF page belonging to an outline item
async function getOutlinePage(item) {

    if (!item.dest) {
        return null;
    }


    let destination = item.dest;


    if (typeof destination === 'string') {

        destination =
            await pdfDocument.getDestination(
                destination
            );
    }


    if (
        !Array.isArray(destination) ||
        !destination[0]
    ) {
        return null;
    }


    try {

        const pageIndex =
            await pdfDocument.getPageIndex(
                destination[0]
            );


        return pageIndex + 1;

    } catch {

        return null;
    }
}


// Build outline recursively
async function buildOutline(
    items,
    container,
    depth = 0
) {

    for (const item of items) {

        const button =
            document.createElement('button');


        button.type = 'button';

        button.classList.add(
            'thumbnail-item',
            'contents-item'
        );


        button.style.paddingLeft =
            `${12 + depth * 14}px`;


        button.textContent =
            item.title || 'Untitled section';


        const pageNumber =
            await getOutlinePage(item);


        if (pageNumber) {

            button.addEventListener(
                'click',
                () => {

                    scrollToPage(pageNumber);
                }
            );
        }


        container.appendChild(button);


        if (
            item.items &&
            item.items.length > 0
        ) {

            await buildOutline(
                item.items,
                container,
                depth + 1
            );
        }
    }
}


// Load contents only when user actually opens it
async function loadContents() {

    if (contentsLoaded) {
        return;
    }


    contentsLoaded = true;


    const outline =
        await pdfDocument.getOutline();


    if (!outline || outline.length === 0) {

        const message =
            document.createElement('p');


        message.textContent =
            'This PDF does not contain a table of contents.';


        contentsList.appendChild(
            message
        );


        return;
    }


    await buildOutline(
        outline,
        contentsList
    );
}


// ============================================================
// THUMBNAIL / CONTENTS TABS
// ============================================================

thumbnailsTabBtn.addEventListener(
    'click',
    () => {

        thumbnailsTabBtn.classList.add(
            'sidebar-tab-active'
        );

        contentsTabBtn.classList.remove(
            'sidebar-tab-active'
        );


        thumbnailList.hidden = false;
        contentsList.hidden = true;
    }
);


contentsTabBtn.addEventListener(
    'click',
    async () => {

        contentsTabBtn.classList.add(
            'sidebar-tab-active'
        );

        thumbnailsTabBtn.classList.remove(
            'sidebar-tab-active'
        );


        thumbnailList.hidden = true;
        contentsList.hidden = false;


        await loadContents();
    }
);


// ============================================================
// INITIAL STATE
// ============================================================

setCurrentPage(1);

updateZoomDisplay();


// Make sure page 1 starts rendering immediately
await renderPage(
    1,
    getPageContainer(1)
);