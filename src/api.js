export const defaultUrl = 'https://pixabay.com/api/';
const api_Key = '44224753-2ced0cf292e08055598c801ea';

export const options = {
  params: {
    key: api_Key,
    q: '',
    imageType: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};
