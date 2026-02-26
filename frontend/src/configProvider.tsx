import React from 'react';
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/system';
interface Props {
	i18n: any;
	children: React.ReactNode;
}
const ConfigProvider = (props: Props) => {
	const { i18n, children } = props;

	return (
		<ThemeProvider
			theme={createTheme({
				direction: i18n.dir(),
				palette: {
					primary: {
						main: 'white',
					},
					secondary: {
						main: 'green',
					},
				},
			})}
		>
			{children}
		</ThemeProvider>
	);
};

export default ConfigProvider;
