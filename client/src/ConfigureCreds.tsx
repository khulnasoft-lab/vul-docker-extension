
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SendMetric } from './Metrics';

export function ConfigureCreds(props: any) {

    let loginDisplay = !props.loggedIn ? "flex" : "none";
    let logoutDisplay = props.loggedIn ? "block" : "none";

    const handleSignInClick = () => {
        props.setOpen(true);
    };

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleSaveDetails = () => {
        let payload = { khulnasoft_key: props.khulnasoftKey, khulnasoft_secret: props.khulnasoftSecret, khulnasoft_cspm_url: props.khulnasoftCSPMUrl };
        console.log(payload);
        window.ddClient.extension.vm.service.request({ url: "/credentials", method: "POST", headers: { 'Content-Type': 'application/json' }, data: payload })
            .then(() => {
                window.ddClient.desktopUI.toast.success(
                    `Successfully logged in`
                );
                SendMetric("vul_khulnasoft_login_successful", { khulnasoftKey: props.khulnasoftKey });
                props.setLoggedIn(true);
                props.setOpen(false);
            })
            .catch((error: any) => {
                window.ddClient.desktopUI.toast.error(
                    `Failed to validate login credentials`
                );
                SendMetric("vul_khulnasoft_login_failed", { khulnasoftKey: props.khulnasoftKey });
                props.setKhulnaSoftKey("");
                props.setKhulnaSoftSecret("");
                props.setKhulnaSoftCSPMUrl("");
                console.log(error);
            });
    };

    const handleSignOutClick = () => {
        props.setKhulnaSoftKey("");
        props.setKhulnaSoftSecret("");
        props.setKhulnaSoftCSPMUrl("");
        props.setLoggedIn(false);

        let payload = { khulnasoft_key: "", khulnasoft_secret: "" };
        console.log(payload);
        window.ddClient.extension.vm.service.delete("/credentials")
            .then(() => {
                window.ddClient.desktopUI.toast.success(
                    `Successfully logged out`
                );
                props.setOpen(false);
            })
            .catch((error: any) => {
                window.ddClient.desktopUI.toast.error(
                    `Failed to logout`
                );
                console.log(error);
            });
    };

    const handleAVDLinkClick = (e: any) => {
        { window.ddClient.host.openExternal("https://cloud.khulnasoftsec.com/cspm/#/apikeys") };
    }

    return (
        <Box sx={{ float: 'right', marginTop: '0.5rem' }}>
            <Button onClick={handleSignInClick} sx={{ display: loginDisplay, fontSize: '12pt', marginTop: '-2px' }}>
                Sign in to KhulnaSoft
            </Button>
            <Button onClick={handleSignOutClick} sx={{ display: logoutDisplay, fontSize: '12pt', marginTop: '-2px' }}>
                Sign out
            </Button>
            <Dialog open={props.open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your KhulnaSoft Security API credentials, these are available in your KhulnaSoft CSPM Account
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="khulnasoftKey"
                        label="KhulnaSoft Key"
                        type="password"
                        value={props.khulnasoftKey}
                        onChange={(e) => props.setKhulnaSoftKey(e.target.value)}
                        fullWidth
                        variant="standard"
                        helperText="AQUA_KEY provided in your CSPM account"
                    />
                    <TextField
                        margin="dense"
                        id="khulnasoftSecret"
                        label="KhulnaSoft Secret"
                        type="password"
                        value={props.khulnasoftSecret}
                        onChange={(e) => props.setKhulnaSoftSecret(e.target.value)}
                        fullWidth
                        variant="standard"
                        helperText="AQUA_SECRET provided in your CSPM account"
                    />
                  <TextField
                    margin="dense"
                    id="khulnasoftCSPMUrl"
                    label="KhulnaSoft CSPM Url"
                    type="text"
                    value={props.khulnasoftCSPMUrl}
                    onChange={(e) => props.setKhulnaSoftCSPMUrl(e.target.value)}
                    fullWidth
                    variant="standard"
                    helperText="AQUA_CSPM_URL provided in your CSPM account"
                  />

                </DialogContent>
                <DialogActions>
                    <Button sx={{ float: 'left' }} onClick={handleAVDLinkClick}>Get API Keys</Button>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                    <Button variant="contained" onClick={handleSaveDetails}>Login</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}