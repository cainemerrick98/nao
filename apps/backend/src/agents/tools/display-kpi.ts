import { displayKpi } from '@nao/shared/tools';
import { tool } from 'ai';

import { DisplayKpiOutput, renderToModelOutput } from '../../components/tool-outputs';

export default tool<displayKpi.Input, displayKpi.Output>({
	description: 'Display a KPI card or banner of the data from previous `execute_sql` tool calls.',
	inputSchema: displayKpi.InputSchema,
	outputSchema: displayKpi.OutputSchema,

	execute: async ({ kpis }) => {
		// Validate a kpi has been passed
		if (kpis.length === 0) {
			return { _version: '1', success: false, error: 'At least one kpi is required' };
		}

		return { _version: '1', success: true };
	},

	toModelOutput: ({ output }) => renderToModelOutput(DisplayKpiOutput({ output }), output),
});
