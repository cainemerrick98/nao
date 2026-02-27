import { displayDatatable } from '@nao/shared/tools';
import { tool } from 'ai';

// TODO Replace with DisplayDataTable ouput
import { DisplayChartOutput, renderToModelOutput } from '../../components/tool-outputs';

export default tool<displayDatatable.Input, displayDatatable.Output>({
	description: 'Display an interactive datatable from a previous `execute_sql` tool call.',
	inputSchema: displayDatatable.InputSchema,
	outputSchema: displayDatatable.OutputSchema,

	toModelOutput: ({ output }) => renderToModelOutput(DisplayChartOutput({ output }), output),
});
