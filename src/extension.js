// top level await is available in ES modules loaded from script tags
const [tab] = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true,
});

let storedimg = localStorage.getItem("chesshelper");
let storedusr = null;
const a = document.createElement("div");
let su = document.getElementById("selected-user");
a.id = "user-avatar-1";
a.style.textAlign = "center";
if (storedimg) {
  storedimg = JSON.parse(storedimg);
  storedusr = storedimg["user"];
  storedimg = storedimg["img"];
  let c = document.createElement("h3");
  let d = document.createElement("img");
  c.textContent = storedusr;
  d.src = storedimg;
  d.alt = "avatar_image";
  d.id = "user-avatar-img";
  a.appendChild(d);
  a.appendChild(c);
  su.prepend(a);
} else {
  document.getElementById("profile-howto").style.maxWidth = "20rem";
}

let selectedUrl = null;

const avatarUrls = [
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/anime_spirited_away_no_face_nobody-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/grandma_elderly_nanny_avatar-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/student-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-24-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/add_user-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/4-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/user-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_40-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/moderator-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Daughter-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_7-64.png",
  "https://cdn4.iconfinder.com/data/icons/health-care-and-first-responders-with-masks/64/doctor-white-male-coronavirus-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-11-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/17-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-4-64.png",
  "https://cdn3.iconfinder.com/data/icons/emoji-1-4/64/_love_heart_smiley-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/23-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-06-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-03-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-01-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/19-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/24-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportmale-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/wrestler_luchador_fighter_man-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/police-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_15-64.png",
  "https://cdn4.iconfinder.com/data/icons/smileys-for-fun/128/smiley__25-64.png",
  "https://cdn4.iconfinder.com/data/icons/smileys-for-fun/128/smiley__12-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-09-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_20-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_31-64.png",
  "https://cdn3.iconfinder.com/data/icons/emoji-1-4/64/_happy_smiley-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-16-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/boy-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-20-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-21-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/add_group-64.png",
  "https://cdn2.iconfinder.com/data/icons/muslim-emoji-part-1/512/muslim_islam_emoji_face-02-64.png",
  "https://cdn4.iconfinder.com/data/icons/smileys-for-fun/128/smiley__11-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman2-64.png",
  "https://cdn4.iconfinder.com/data/icons/smileys-for-fun/128/smiley__8-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-13-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/malecostume-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/65-woman-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/18-man-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/fireman-64.png",
  "https://cdn4.iconfinder.com/data/icons/health-care-and-first-responders-with-masks/64/pharmacist-white-male-coronavirus-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/54-woman-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/14-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/35-voice_actor-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-normal-bg-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/9-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/10-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/6-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-pretty-bg-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_8-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/06-student-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Uncle-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/12-64.png",
  "https://cdn4.iconfinder.com/data/icons/health-care-and-first-responders-with-masks/64/surgeon-black-male-coronavirus-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/5-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/marilyn_monroe_artist_avatar-64.png",
  "https://cdn1.iconfinder.com/data/icons/santa-emojis/60/004_-_santa_christmas_emoji_cool_sunglasses-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-2-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/22-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_4-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-04-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Grandmother-64.png",
  "https://cdn3.iconfinder.com/data/icons/emoji-1-4/64/_heart_sexy_love-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/2-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-11-2-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Brother-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/18-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/16-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/3-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_21-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/1-64.png",
  "https://cdn2.iconfinder.com/data/icons/muslim-emoji-part-1/512/muslim_islam_emoji_face-24-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-12-4-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-13-2-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/cloud_crying_rain_avatar-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/doctor-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/21-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_22-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/8-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-23-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/20-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-18-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/7-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Grandfather-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-cap-bg-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/sloth_lazybones_sluggard_avatar-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/suicide_squad_woman_avatar_joker-64.png",
  "https://cdn2.iconfinder.com/data/icons/muslim-emoji-part-1/512/muslim_islam_emoji_face-45-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Aunt-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/04-man-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Sister-64.png",
  "https://cdn1.iconfinder.com/data/icons/family-avatar-solid-happy-party/1000/Asian_Male005-64.png",
  "https://cdn4.iconfinder.com/data/icons/health-care-and-first-responders-with-masks/64/firefighter-white-male-coronavirus-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/13-64.png",
  "https://cdn1.iconfinder.com/data/icons/family-avatar-solid-happy-party/1000/Asian_Female007-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-19-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Mother-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/coffee_zorro_avatar_cup-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/sheep_mutton_animal_avatar-64.png",
  "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/avocado_scream_avatar_food-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-6-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/male-64.png",
  "https://cdn3.iconfinder.com/data/icons/emoji-1-4/64/_thinking_think_emoji-64.png",
  "https://cdn4.iconfinder.com/data/icons/smileys-for-fun/128/smiley__14-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-avatar-20/64/24-Miner-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/supportmale-2-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Son-64.png",
  "https://cdn4.iconfinder.com/data/icons/health-care-and-first-responders-with-masks/64/doctor-asian-female-coronavirus-2-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/11-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-08-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/girl-64.png",
  "https://cdn3.iconfinder.com/data/icons/family-member-flat-happy-family-day/512/Father-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-runner-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-22-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-headset-bg-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/15-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-round_hair-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-02-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-line-doodle/91/Emoji_LIne_Doodle_C-26-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/remove_user-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-14-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-18/61/25-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman2-2-64.png",
  "https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-64.png",
  "https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/cook-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-8-2-64.png",
  "https://cdn1.iconfinder.com/data/icons/santa-emojis/60/017_-_santa_christmas_emoji_angry_mad-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-15-64.png",
  "https://cdn1.iconfinder.com/data/icons/santa-emojis/60/002_-_santa_christmas_emoji_love-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-16-64.png",
  "https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-1-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-driving-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/boy-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-normal-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-headband-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-runner-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/female-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/supportfemale-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-reading-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-reading-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-driving-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-cap-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/girl-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-heart-bg-64.png",
  "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-pretty-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-round_hair-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-heart-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_11-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_10-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_14-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_25-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_35-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_30-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_37-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_16-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_39-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_33-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Man-1-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Love-Letter-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Application-Map-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_32-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_36-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_28-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Heart-Watch-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/8_avatar-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_2-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Video-Camera-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-headband-64.png",
  "https://cdn0.iconfinder.com/data/icons/female-styles/500/woman-headset-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_1-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Money-Graph-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_34-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_6-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_29-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_12-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Nurse-1-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_19-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Checklist-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_9-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Application-Map-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_5-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_17-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/2_avatar-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_27-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_3-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_26-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Gold-Cart-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_38-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_23-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Microscope-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Open-Sign-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_13-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_18-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/5_avatar-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Money-Graph-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/1_avatar-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Chat-2-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/12_avatar-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Graph-Magnifier-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Farmer-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Batman-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Mind-Map-Paper-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Man-1-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-64.png",
  "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-64.png",
  "https://cdn4.iconfinder.com/data/icons/emoji-outline-3/64/EMOJI_ICON_SET-05-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Woman-15-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Telemarketer-Woman-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Beach-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Mind-Map-Paper-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Xylophone-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Battery-Charging-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Money-Increase-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Images-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Old-Car-2-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Candy-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Online-Shopping-64.png",
  "https://cdn4.iconfinder.com/data/icons/round-smiley-emoticons/32/24-sad-64.png",
  "https://cdn2.iconfinder.com/data/icons/emoji-line/32/emoji_24-64.png",
  "https://cdn4.iconfinder.com/data/icons/round-smiley-emoticons/32/1-smile-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Road-Worker-1-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Cement-Mixer-64.png",
  "https://cdn0.iconfinder.com/data/icons/kameleon-free-pack/110/Makeup-64.png",
];

let ulcontainer = document.getElementById("avatar-list");

avatarUrls.forEach((url, idx) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = url;
  img.classList.add("avatar-image-item");
  li.appendChild(img);
  li.id = idx;
  li.addEventListener("click", function () {
    selectedUrl = url;
    img.style.border = "solid red";
    // Remove border from other list items
    const imageItems = document.getElementsByClassName("avatar-image-item");
    for (let i = 0; i < imageItems.length; i++) {
      if (imageItems[i].src !== url) {
        imageItems[i].style.border = "";
      }
    }
  });
  ulcontainer.appendChild(li);
});

let flipboardelem = document.getElementById("flipview");
let myToggle = document.getElementById("myToggle");
let bv = localStorage.getItem("boardview");

if (!bv) {
  localStorage.setItem("boardview", "lichess");
  bv = "lichess";
}
if (bv == "chess.com") {
  myToggle.checked = true;
}

document
  .getElementById("username-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputValue = document.getElementById("username-input").value;
    if (!inputValue || !selectedUrl) {
      return;
    }
    try {
      refreshbtn.style.animation = "loading-spinner 0.5s linear infinite";
      let response = await fetch(
        `https://stockfishapi-jh4a3z47hq-uk.a.run.app/set-avatar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: inputValue,
            img: selectedUrl,
          }),
        },
      );
      if (response.ok) {
        response
          .json()
          .then((data) => {
            if (data.hasOwnProperty("data")) {
              if (su.querySelector("#user-avatar-1") !== null) {
                a.innerHTML = "";
              }

              const c = document.createElement("h3");
              const d = document.createElement("img");

              c.textContent = inputValue;
              d.src = selectedUrl;
              d.id = "user-avatar-img";
              d.alt = "avatar_image";
              c.id = "user-avatar-text";

              a.appendChild(d);
              a.appendChild(c);
              if (su.querySelector("#user-avatar-1") == null) {
                su.prepend(a);
              }
              document.getElementById("profile-howto").style.maxWidth = "16rem";

              const userData = { user: inputValue, img: selectedUrl };
              localStorage.setItem("chesshelper", JSON.stringify(userData));
            }
          })
          .catch((error) => {
            console.error("Error parsing JSON:", error);
          });
      }
    } catch (e) {
      console.error(e);
    } finally {
      refreshbtn.style.animation = "";
    }
  });

const tabId = tab.id;
const button = document.getElementById("openSidePanel");
button.addEventListener("click", async () => {
  await chrome.sidePanel.open({ tabId });
  await chrome.sidePanel.setOptions({
    tabId,
    path: "index.html",
    enabled: true,
  });
});

const refreshbtn = document.getElementById("loading-spinner");
refreshbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let n = document.getElementById("username-input");
  try {
    if (storedusr !== n && n.value.length > 1) {
      refreshbtn.style.animation = "loading-spinner 0.5s linear infinite";
      let response = await fetch(
        `https://stockfishapi-jh4a3z47hq-uk.a.run.app/get-useravatar/${n.value}`,
      );
      if (response.ok) {
        response.json().then((data) => {
          if (data.hasOwnProperty("user")) {
            if (su.querySelector("#user-avatar-1") !== null) {
              a.innerHTML = "";
            }
            let c = document.createElement("h3");
            let d = document.createElement("img");
            c.textContent = data.user;
            d.src = data.img;
            d.alt = "avatar_image";
            d.id = "user-avatar-img";
            a.appendChild(d);
            a.appendChild(c);
            refreshbtn.style.animation = "";
            document.getElementById("profile-howto").style.maxWidth = "16rem";
            if (su.querySelector("#user-avatar-1") == null) {
              su.prepend(a);
            }
            localStorage.setItem(
              "chesshelper",
              JSON.stringify({ user: data.user, img: data.img }),
            );
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    refreshbtn.style.animation = "";
  }
});

let supportl = document.getElementById("supportlink");
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
supportl.addEventListener("click", function () {
  if (modal.hidden) {
    modal.hidden = false;
  }
});
span.addEventListener("click", function () {
  modal.hidden = true;
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.hidden = true;
  }
};

flipboardelem.addEventListener("change", function () {
  if (bv == "lichess") {
    myToggle.checked = true;
    localStorage.setItem("boardview", "chess.com");
    bv = "chess.com";
  } else if (bv == "chess.com") {
    localStorage.setItem("boardview", "lichess");
    myToggle.checked = false;
    bv = "lichess";
  } else {
    localStorage.setItem("boardview", "lichess");
    myToggle.checked = false;
    bv = "lichess";
  }
});

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  let g = key.substring(0, key.length - 8);
  let b = new Date(g);
  if (b.toString() == "Invalid Date") continue;

  if (key.includes("lichess")) {
    const data = JSON.parse(localStorage.getItem(key));

    if (Array.isArray(data)) {
      let chli = document.getElementById("dtopt");
      chli.style.display = "list-item";
      break;
    }
  }
}

var opendata = document.getElementById("datatable");
opendata.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "open_table" });
});
