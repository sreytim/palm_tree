/**
 * Central image registry.
 *
 * Maintains a single source of truth for all images in the app so real media
 * can replace the placeholders without changing component code.
 *
 * Recommended structure:
 * public/images/
 *   hero/
 *   categories/
 *   process/
 *   techniques/
 *   archive/
 *   stories/
 *   gallery/
 *   about/
 */
const asset = (folder, filename, extension = "svg") => `/images/${folder}/${filename}.${extension}`;
export const images = {
    heroHouse: "/about.jpg",
    heroTexture: "/images/palm-tree.jpeg",
    categorySelecting: asset("categories", "selecting"),
    categoryPreparing: "/palm_leaf1.jpg",
    categoryWeaving: "/palm_leaf3.jpg",
    categoryAttaching: "/covering.jpeg",
    categoryMaintaining: "/maintain.jpg",
    categoryStories: "/stories_from_elders.png",
    categoryHouses: "/palm_house1.jpg",
    processInterview: asset("process", "interview"),
    processDocument: asset("process", "document"),
    processPhotograph: asset("process", "photograph"),
    processPreserve: asset("process", "preserve"),
    processShare: asset("process", "share"),
    step1Selecting: asset("techniques", "step-1-selecting"),
    step2Preparing: asset("techniques", "step-2-preparing"),
    step3Drying: asset("techniques", "step-3-drying"),
    step4Weaving: asset("techniques", "step-4-weaving"),
    step5Attaching: asset("techniques", "step-5-attaching"),
    step6Maintaining: asset("techniques", "step-6-maintaining"),
    archive1: "/palm_leaf_houses.png",
    archive2: "/roof_covering.jpg",
    archive3: "/wall_covering.jpg",
    archive4: "/palm_leaf_preparation.jpg",
    archive5: "/leaf_weaving.jpg",
    archive6: "/house_construction.jpg",
    archive7: "/traditional_house_types.png",
    archive8: "/maintenance_repair.jpeg",
    storyPortrait1: asset("stories", "portrait-1"),
    storyPortrait2: asset("stories", "portrait-2"),
    storyPortrait3: asset("stories", "portrait-3"),
    storyPortrait4: asset("stories", "portrait-4"),
    galleryLeaves1: asset("gallery", "leaves-1"),
    galleryLeaves2: asset("gallery", "leaves-2"),
    galleryHouse1: "/palm_house1.jpg",
    galleryHouse2: asset("gallery", "house-2"),
    galleryTools1: asset("gallery", "tools-1"),
    galleryWeaving1: asset("gallery", "weaving-1"),
    galleryWeaving2: asset("gallery", "weaving-2"),
    galleryPreparing1: "/palm_leaf1.jpg",
    galleryAttaching1: asset("gallery", "attaching-1"),
    galleryFinished1: "/palm_house1.jpg",
    galleryFinished2: asset("gallery", "finished-2"),
    galleryCommunity1: asset("gallery", "community-1"),
    galleryCommunity2: asset("gallery", "community-2"),
    galleryCommunity3: asset("gallery", "community-3"),
    aboutFounder: "/about.jpg",
    aboutCommunity: "/about.jpg",
};
