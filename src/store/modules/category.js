import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

// 액션 타입 정의
const SET_SELECT = 'category/SET_SELECT';

// 액션 생성 함수
export const setSelect = createAction(SET_SELECT);

// 모듈의 초기 상태 정의
const initialState = Map({
  categories: List([
    Map({
      id: 0,
      name: '전체',
      menu: List([])
    }), Map({
      id: 1,
      name: '한식',
      menu: List([
        '국밥',
        '김치찌개',
        '낚지덮밥',
        '닭볶음탕',
        '덮밥',
        '돈가스',
        '돌솥비빔밥',
        '두부전골',
        '된장찌개',
        '뼈해장국',
        '부대찌개',
        '비빔밥',
        '선지해장국',
        '설렁탕',
        '생선구이',
        '생선조림',
        '수제비',
        '순대국',
        '순두부찌개',
        '육개장',
        '육회비빔밥',
        '찜닭',
        '칼국수',
        '한우국밥'
      ])
    }), Map({
      id: 2,
      name: '중식',
      menu: List([
        '중식',
        '깐풍기',
        '마라탕',
        '마파두부',
        '만두',
        '볶음밥',
        '오리구이',
        '자장면',
        '짬뽕',
        '탕수육',
        '허궈'
      ])
    }), Map({
      id: 3,
      name: '일식',
      menu: List([
        '일식',
        '가츠동',
        '규동',
        '돈부리',
        '돈까스',
        '라멘',
        '샤브샤브',
        '생선가스',
        '소바',
        '스시',
        '오뎅',
        '오므라이스',
        '오코노미야키',
        '우동',
        '초밥',
        '카레',
        '카레라이스',
        '커틀릿',
        '타타키'
      ])
    }), Map({
      id: 4,
      name: '양식',
      menu: List([
        '양식',
        '도넛',
        '베이글',
        '부리토',
        '브런치',
        '리조또',
        '소시지',
        '스테이크',
        '연어',
        '오믈렛',
        '치킨',
        '케밥',
        '타코',
        '토르티야',
        '파스타',
        '팬케이크',
        '피자',
        '핫도그',
        '햄버거'
      ])
    }), Map({
      id: 5,
      name: '면류',
      menu: List([
        '국수',
        '냉면',
        '냉우동',
        '라면',
        '라멘',
        '막국수',
        '메밀국수',
        '모밀국수',
        '밀면',
        '비빔국수',
        '쌀국수',
        '우동',
        '육개장',
        '자장면',
        '짬뽕',
        '쫄면',
        '칼국수',
        '콩국수',
        '파스타'
      ])
    }), Map({
      id: 6,
      name: '패스트푸드',
      menu: List([
        '국수',
        '김밥',
        '나초',
        '떡볶이',
        '라면',
        '딤섬',
        '만두',
        '오뎅',
        '샌드위치',
        '순대국',
        '치킨',
        '케밥',
        '타코규동',
        '피자',
        '핫도그',
        '햄버거'
      ])
    }), Map({
      id: 7,
      name: '분식',
      menu: List([
        '분식'
      ])
    }), Map({
      id: 8,
      name: '치킨',
      menu: List([
        '치킨'
      ])
    }), Map({
      id: 9,
      name: '피자',
      menu:  List([
        '피자'
      ])
    })
  ]),
  selected: List([])
});

export default handleActions({
  [SET_SELECT]: (state, { payload:selected }) => {
    return state.set('selected', selected);
  }
}, initialState);
