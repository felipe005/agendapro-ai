const garmentTypeLabels = {
  pants: "tailored pants",
  jeans: "premium denim jeans",
  skirt: "fashion skirt",
  dress: "editorial dress",
  jacket: "statement jacket",
  shirt: "designer shirt",
  shoes: "fashion shoes",
  fullLook: "complete fashion look"
};

const motionLabels = {
  elegant: "an elegant and controlled runway walk",
  bold: "a bold catwalk with confidence",
  street: "a dynamic fashion-film walk with street energy",
  luxury: "a luxurious high-fashion presentation"
};

const cameraLabels = {
  frontal: "front-facing camera tracking the model",
  orbit: "a subtle orbiting camera around the model",
  side: "a lateral tracking shot that highlights silhouette and movement",
  editorial: "an editorial camera move with cinematic push-ins"
};

const backgroundLabels = {
  studio: "a premium studio runway with soft shadow gradients",
  city: "a modern city fashion set with polished reflections",
  noir: "a dark cinematic runway with dramatic spotlights",
  sunset: "a warm sunset fashion show ambience"
};

export function buildFashionPrompt(input) {
  const garment = garmentTypeLabels[input.garmentType] || "fashion garment";
  const motion = motionLabels[input.motionStyle] || motionLabels.elegant;
  const camera = cameraLabels[input.cameraStyle] || cameraLabels.frontal;
  const background = backgroundLabels[input.backgroundStyle] || backgroundLabels.studio;

  const details = [
    input.brandName ? `${input.brandName} campaign` : null,
    input.garmentDescription ? `The hero piece is ${input.garmentDescription.trim()}.` : `The hero piece is a ${garment}.`,
    input.styleNotes ? `Style notes: ${input.styleNotes.trim()}.` : null,
    input.targetAudience ? `The visual language should appeal to ${input.targetAudience.trim()}.` : null,
    `${motion}.`,
    `${camera}.`,
    `Scene: ${background}.`,
    "The garment must remain visually faithful to the uploaded reference image in color, texture, fit, trims, seams, and overall silhouette.",
    "Create a realistic fashion model wearing the garment naturally, with premium lighting, believable fabric movement, refined skin details, and luxury-brand quality.",
    "No warped anatomy, no duplicated limbs, no extra garments, no logo distortion, no text overlays, no low-resolution artifacts."
  ].filter(Boolean);

  return details.join(" ");
}

export function buildNegativePrompt() {
  return [
    "blurry output",
    "distorted body",
    "mutated hands",
    "cropped legs",
    "garment mismatch",
    "extra clothing layers",
    "low detail",
    "flicker",
    "poor fabric texture",
    "deformed face"
  ].join(", ");
}
