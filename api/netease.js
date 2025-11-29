import axios from 'axios';


export async function search(keywords = '') {
if (!keywords) return { results: [] };
const params = { s: keywords, type: 1, limit: 10 };
const { data } = await axios.get('https://music.163.com/api/search/get', {
params,
headers: { Referer: 'https://music.163.com' },
timeout: 8000
});


const songs = (data.result?.songs || []).map(song => ({
id: song.id,
name: song.name,
artist: (song.artists || song.ar || []).map(a => a.name).join(', '),
album: song.album?.name || song.al?.name || '',
pic: song.album?.picUrl || song.al?.picUrl || '',
duration: song.duration || song.dt || 0
}));


return { source: 'netease', results: songs };
}


export async function song(id) {
if (!id) throw new Error('缺少 id');
const { data } = await axios.get('https://music.163.com/api/song/detail', {
params: { ids: `[${id}]` },
headers: { Referer: 'https://music.163.com' },
timeout: 8000
});


const s = data.songs?.[0] || {};
return {
id: s.id,
name: s.name,
artist: (s.ar || []).map(a => a.name).join(', '),
album: s.al?.name || '',
pic: s.al?.picUrl || s.album?.picUrl || '',
url: `https://music.163.com/song/media/outer/url?id=${s.id}.mp3`
};
}


export async function lyric(id) {
if (!id) throw new Error('缺少 id');
const { data } = await axios.get('https://music.163.com/api/song/lyric', {
params: { id, lv: -1, kv: -1, tv: -1 },
headers: { Referer: 'https://music.163.com' },
timeout: 8000
});


return { id, lrc: data.lrc?.lyric || '' };
}
