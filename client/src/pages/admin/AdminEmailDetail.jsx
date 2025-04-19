import { useParams } from "react-router-dom"
import './admin-email-detail.css';
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import ToastNotification, { showToast } from "../../components/toasts/ToastNotification";
import { getEmailsByAlias } from "../../api/gmail.api";
import EMPTY_MAIL from './../../assets/images/empty-mail.png';
import { TbRefresh } from "react-icons/tb";

export const AdminEmailDetail = () => {
    const { alias } = useParams();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = `Email: ${alias}`;
    }, []);

    useEffect(() => {
        fetchEmail();
    }, [alias]);    

    const fetchEmail = async () => {
        try {
            setLoading(true);

            const res = await getEmailsByAlias(alias);

            if (res.success) {
                setEmail(res.data);
            }
        } catch (error) {
            showToast(error.message, "error");
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
    return (
      <div className="loader-container">
        <HashLoader color="#092339" />
      </div>
    );
  }

    return (
        <div className="admin-email-detail-container">
            <ToastNotification/>
            <span className="tab-nav-title">
                <a href="/super-admin/emails">Danh sách email</a> / {alias}
            </span>
            <div className="admin-detail-header-container">
                <h2 className="admin-email-detail-title">Hộp thư đến</h2>
                <button disabled={loading} onClick={fetchEmail} className="admin-email-detail-refresh-button">
                    <TbRefresh className="admin-email-detail-refresh-icon"/>
                </button>
            </div>
            <div className="admin-email-detail-inboxes-container">
                {email?.emails && email?.emails.length > 0 ?
                    email?.emails.map((em) => (
                        <InboxCard mail={em}/>
                    ))
                :
                    <div className="empty-mail-container">
                        <img className="empty-mail-img" src={EMPTY_MAIL}></img>
                        <p className="empty-mail">Chưa có thư đến</p>
                </div>
                }
            </div>
        </div>
    )
}

const InboxCard = ({ mail }) => {
    return (
        <div className="inbox-card-container">
            <p className="email-subject">{mail?.subject}</p>
            <p><span className="email-props-title">Từ:</span> {mail?.from}</p>
            <p><span className="email-props-title">Thời gian:</span> {new Date(mail?.date).toLocaleString("vi-VN")}</p>
            <p>{mail?.body}</p>
        </div>
    )
}