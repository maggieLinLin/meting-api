import axios from 'axios';


export async function search(keywords = '') {
if (!keywords) return { results: [] };
const params = { w: keywords, p: 1, n: 10, format: 'json' };
const { data } = await axios.get('https://cyqq.com/soso/fcgi-bin/client_search_cp', {
params,
timeout: 8000
});


const list = data?.data?.song?.list || [];
const songs = list.map(song => ({
id: song.songmid,
name: song.songname || song.songname || song.name,
artist: (song.singer || song.singer || []).map(s => s.name).join(', '),
album: song.albumname || song.album?.name || '',
duration: (song.interval || song.interval) * 1000 || 0
}));


return { source: 'tencent', results: songs };
}


export async function song(id) {
if (!id) throw new Error('缺少 id');
// 這個 URL 給出一個穩定的串流路徑樣式，適用於多數 client
return {
id,
url: `https://ws.stream.qqmusic.qq.com/C400${id}.m4a?fromtag=0`
};
}


export async function lyric(id) {
if (!id) throw new Error('缺少 id');
const params = { songmid: id, format: 'json' };
const { data } = await axios.get('https://cyqq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
params,
headers: { Referer: 'https://y.qq.com' },
timeout: 8000
});


return { id, lrc: data?.lyric || '' };
}
