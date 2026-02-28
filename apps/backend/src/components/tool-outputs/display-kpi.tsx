import type { displayKpi } from '@nao/shared/tools';

import { Block } from '../../lib/markdown';

export function DisplayKpiOutput({ output }: { output: displayKpi.Output }) {
	if (output.error) {
		return <Block>Could not display the KPI: {output.error}</Block>;
	}
	return <Block>KPI displayed successfully.</Block>;
}
