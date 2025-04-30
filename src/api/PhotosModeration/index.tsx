import axios from 'axios';

export const checkImageModeration = async (imageUrl: string): Promise<boolean> => {
  const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
    params: {
      url: imageUrl,
      models: 'nudity-2.1,weapon,gore-2.0',
      api_user: '1605633895',
      api_secret: '6BJeqs3VyH7DJHrY96fjDAW2cbCGuyzk',
    },
  });

  const result = response.data;

  const { nudity, weapon, gore } = result;

  const isNude =
    nudity?.sexual_activity > 0.2 ||
    nudity?.sexual_display > 0.5 ||
    nudity?.erotica > 0.85 ||
    nudity?.very_suggestive > 0.9 ||
    nudity?.suggestive > 0.9;

  const isViolent =
    weapon?.weapon > 0.5 ||
    gore?.gore > 0.5;

  return !(isNude || isViolent);
};