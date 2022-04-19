import './JSDigestProvider';
import './SimpleTransactionSigner';
import './NullAVMProgramProvider';
import './SessionWalletAccountProvider';
import './StaticAlgodConfigProvider';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';

const API_URL = process.env.REACT_APP_API_URL ?? '';
const API_URL_CAUSES = process.env.REACT_APP_API_URL_CAUSES ?? '';

// Provide custom targets for the network service
Container.set(NetworkClient, new NetworkClient(API_URL, API_URL_CAUSES));
