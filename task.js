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
    }, data.mass_delay * 100 || 30000);
  });
}

async function taskMass(info) {
  const selectList = _.get(info, 'select_list',[]);
  if (!_.isEmpty(selectList)) {
    for (let i = 0; i < selectList.length; i++) {
      const element = selectList[i];
      await singleMass(_.assign({}, element, info));
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
    }, 30000);
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
    singleGather(_.assign({}, data, result));
  }
}

async function init() {
  try {
    const data = await request({
      url: '/api/tg/getList',
      method: 'get',
    });
    const list = _.get(data, 'list', []);

    for (let i = 0; i < list.length; i++) {
      const info = list[i];
      await taskGather(info);
    }

    for (let i = 0; i < list.length; i++) {
      const info = list[i];
      await taskMass(info);
    }
  } catch (error) {
    console.log('error:', error);
  }
}

init();
