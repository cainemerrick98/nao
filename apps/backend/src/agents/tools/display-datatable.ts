import { displayDatatable } from '@nao/shared/tools';
import { tool } from 'ai';

import { DisplayDatatableOutput, renderToModelOutput } from '../../components/tool-outputs';

export default tool<displayDatatable.Input, displayDatatable.Output>({
	description: 'Display an interactive datatable from a previous `execute_sql` tool call.',
	inputSchema: displayDatatable.InputSchema,
	outputSchema: displayDatatable.OutputSchema,
	execute: async ({ query_id }) => {
		if (query_id === '') {
			return { _version: '1', success: false, error: 'query_id is required' };
		}

		return { _version: '1', success: true };
	},
	toModelOutput: ({ output }) => renderToModelOutput(DisplayDatatableOutput({ output }), output),
});
