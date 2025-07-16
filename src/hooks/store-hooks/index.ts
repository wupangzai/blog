import useStates from '@/hooks/store-hooks/useStates';
import useGetters from '@/hooks/store-hooks/useGetters';
import useMutations from '@/hooks/store-hooks/useMutations';
import useActions from '@/hooks/store-hooks/useActions';

export { useStates, useGetters, useMutations, useActions };

/**
 * 使用方法
 *
 * const { version } = useStates(["version"]);  //rootState
   const { number, test } = useStates("commonModule", ["number", "test"]);  // moduleState
 *
 *
 * const { "commonModule/total": total, name } = useGetters(["commonModule/total","name"]);
 *
 * const { "commonModule/DECREMENT": DECREMENT, fn } = useMutations(['commonModule/DECREMENT', 'fn'])
 *
 * const { "commonModule/DECREMENT_ACTION": DECREMENT_ACTION, fn } = useActions(['commonModule/DECREMENT_ACTION', 'fn'])
 *
 */
