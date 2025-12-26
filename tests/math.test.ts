import {describe, expect, it} from 'vitest'
import {add} from '@/math'

describe('Math operations', () => {
    describe('sum function', () => {
        it('adds 1 + 2 to equal 3', () => {
            expect(add(1, 2)).toBe(3)
        })

        it('adds -1 + 0 to equal -1', () => {
            expect(add(-1, 0)).toBe(-1)
        })
    })
})
