const request = require('./request.js');
const _ = require('lodash');

async function singleMass(data) {
  await request({
    url: `/api/tg/channelMass`,
    method: 'put',
    data,
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 8888);
  });
}

async function taskMass(info) {
  const list = await request({
    url: `/api/tg/getAllChats`,
    method: 'get',
    params: info,
  });

  const channelList = _.get(list, 'result', []);
  if (!_.isEmpty(channelList)) {
    for (let i = 0; i < channelList.length; i++) {
      const element = channelList[i];
      await singleMass(_.assign({}, info, element));
    }
  }
}

async function singleGather(data) {
  await request({
    url: `/api/tg/gatherChannel`,
    method: 'post',
    data,
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 8888);
  });
}

async function taskGather(data) {
  const list = await request({
    url: `/api/tg/gatherChannel`,
    method: 'put',
    data,
  });

  const gatherList = _.get(list, 'data', []);

  for (let i = 0; i < gatherList.length; i++) {
    const result = gatherList[i];
    await singleGather(_.assign({}, data, result));
  }
}

async function init() {
  try {
    const data = await request({
      url: '/api/tg/getList',
      method: 'get',
    });
    const list = _.get(data, 'list', []).filter(x => x.is_logined === 1)

    for (let i = 0; i < list.length; i++) {
      const info = _.assign({}, list[i], { currentId: list[i].id });
      try {
        await taskGather(info);
        await request({
          url: '/api/tg/updateLog',
          method: 'post',
          data: info,
        });
      } catch (error) { }
    }

    for (let i = 0; i < list.length; i++) {
      const info = _.assign({}, list[i], { currentId: list[i].id });
      try {
        await taskMass(info);
        await request({
          url: '/api/tg/updateLog',
          method: 'post',
          data: info,
        });
      } catch (error) { }
    }
  } catch (err) {
    console.log('err:', err);
  }
}

init();
