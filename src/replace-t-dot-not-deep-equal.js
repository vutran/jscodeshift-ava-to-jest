import utils from './utils'

const replaceTdotNotDeepEqual = (j, root) => {
  const tDotIs = root.find(j.MemberExpression, {
    object: {
      name: 't'
    },
    property: {
      name: 'notDeepEqual'
    }
  })
  tDotIs.forEach(expectation => {
    // Get the entire 't.notDeepEqual(actual, expected)' expression
    const expectationExpression = expectation.parentPath
    const actualValue = utils.getValue(j, expectationExpression.value.arguments[0])
    const expectedValue = utils.getValue(j, expectationExpression.value.arguments[1])
    const newExpect = j.callExpression(
      j.identifier('expect'),
      actualValue
    )
    const not = j.identifier('not')
    const newExpectNot = j.memberExpression(
      newExpect, not
    )
    const newActual = j.callExpression(
      j.identifier('toEqual'),
      expectedValue
    )
    const newExpression = j.memberExpression(
      newExpectNot, newActual
    )
    expectationExpression.replace(newExpression)
  })
}

export default replaceTdotNotDeepEqual