const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// test("테스트 설명", () => {
//     expect("검증 대상").toXxx("기대 결과");  //
//   });