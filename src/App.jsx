import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3001/api";
const DEFAULT_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function App() {
  const [tab, setTab] = useState("disclose");
  const [copied, setCopied] = useState(false);

  // Disclose form state
  const [content, setContent] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [aiToolName, setAiToolName] = useState("");
  const [aiUsageType, setAiUsageType] = useState("");
  const [disclosureResult, setDisclosureResult] = useState(null);
  const [disclosureError, setDisclosureError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verify form state
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  // History form state
  const [historyAddress, setHistoryAddress] = useState("");
  const [historyResult, setHistoryResult] = useState(null);
  const [historyError, setHistoryError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(DEFAULT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDisclose(e) {
    e.preventDefault();
    setLoading(true);
    setDisclosureResult(null);
    setDisclosureError("");
    try {
      const res = await axios.post(`${API}/disclose`, {
        content,
        aiUsed,
        aiToolName,
        aiUsageType,
      });
      setDisclosureResult(res.data);
    } catch (err) {
      setDisclosureError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  }

  async function handleVerify(e) {
    e.preventDefault();
    setVerifyResult(null);
    setVerifyError("");
    try {
      const res = await axios.get(`${API}/verify/${verifyHash}`);
      setVerifyResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setVerifyError("No disclosure found for this content hash.");
      } else {
        setVerifyError(err.response?.data?.error || err.message);
      }
    }
  }

  async function handleHistory(e) {
    e.preventDefault();
    setHistoryLoading(true);
    setHistoryResult(null);
    setHistoryError("");
    try {
      const res = await axios.get(`${API}/history/${historyAddress}`);
      setHistoryResult(res.data);
    } catch (err) {
      setHistoryError(err.response?.data?.error || err.message);
    }
    setHistoryLoading(false);
  }

  const buttonStyle = (active) => ({
    padding: "8px 20px",
    borderRadius: 8,
    border: active ? "none" : "1px solid #534AB7",
    cursor: "pointer",
    background: active ? "#534AB7" : "transparent",
    color: active ? "#fff" : "#534AB7",
    fontWeight: 500,
    fontSize: 14,
  });

  const inputStyle = {
    width: "100%",
    marginTop: 6,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const successBox = {
    background: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    borderLeft: "4px solid #2e7d32",
  };

  const errorBox = {
    background: "#ffebee",
    padding: 16,
    borderRadius: 8,
    borderLeft: "4px solid #c62828",
  };

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>

      {/* Header */}
      <h1 style={{ fontSize: 22, fontWeight: 500 }}>AI Content Disclosure System</h1>
      <p style={{ color: "#666", marginBottom: 12 }}>
        Permanently record and verify AI usage disclosures on the blockchain.
      </p>

      {/* Wallet info box */}
      <div style={{
        background: "#f3f0ff",
        border: "1px solid #534AB7",
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 24,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <span style={{ fontWeight: 500, color: "#534AB7" }}>Default wallet:</span>
        <span style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#333", flex: 1 }}>
          {DEFAULT_WALLET}
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: "3px 12px",
            borderRadius: 6,
            border: "1px solid #534AB7",
            background: copied ? "#534AB7" : "transparent",
            color: copied ? "#fff" : "#534AB7",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab("disclose")} style={buttonStyle(tab === "disclose")}>
          Record Disclosure
        </button>
        <button onClick={() => setTab("verify")} style={buttonStyle(tab === "verify")}>
          Verify Content
        </button>
        <button onClick={() => setTab("history")} style={buttonStyle(tab === "history")}>
          Creator History
        </button>
      </div>

      {/* ── Tab 1: Record Disclosure ── */}
      {tab === "disclose" && (
        <form onSubmit={handleDisclose} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontWeight: 500 }}>Content to disclose</label>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your article, image description, or content here..."
              style={inputStyle}
              required
            />
            <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>
              A SHA-256 hash of this content will be stored on-chain. The content itself is not stored.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              id="aiUsed"
              checked={aiUsed}
              onChange={e => setAiUsed(e.target.checked)}
            />
            <label htmlFor="aiUsed" style={{ fontWeight: 500 }}>
              AI was used to create or assist with this content
            </label>
          </div>

          {aiUsed && (
            <>
              <div>
                <label style={{ fontWeight: 500 }}>AI tool used</label>
                <input
                  value={aiToolName}
                  onChange={e => setAiToolName(e.target.value)}
                  placeholder="e.g. ChatGPT, Claude, Midjourney"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500 }}>How was AI used?</label>
                <select
                  value={aiUsageType}
                  onChange={e => setAiUsageType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select usage type</option>
                  <option value="fully generated">Fully AI-generated</option>
                  <option value="assisted">AI-assisted (human edited)</option>
                  <option value="research">Used for research only</option>
                  <option value="translation">AI translation</option>
                  <option value="image generation">AI image generation</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: loading ? "#999" : "#534AB7",
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            {loading ? "Recording on blockchain..." : "Record Disclosure"}
          </button>

          {disclosureResult && (
            <div style={successBox}>
              <p style={{ fontWeight: 500, color: "#1b5e20", margin: "0 0 8px" }}>
                Disclosure recorded successfully
              </p>
              <p style={{ fontSize: 13, margin: "4px 0", wordBreak: "break-all" }}>
                <b>Content hash:</b> {disclosureResult.contentHash}
              </p>
              <p style={{ fontSize: 13, margin: "4px 0", wordBreak: "break-all" }}>
                <b>Transaction:</b> {disclosureResult.transactionHash}
              </p>
              <p style={{ fontSize: 13, margin: "4px 0" }}>
                <b>Block:</b> {disclosureResult.blockNumber}
              </p>
            </div>
          )}

          {disclosureError && (
            <div style={errorBox}>
              <p style={{ color: "#b71c1c", margin: 0 }}>{disclosureError}</p>
            </div>
          )}
        </form>
      )}

      {/* ── Tab 2: Verify Content ── */}
      {tab === "verify" && (
        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontWeight: 500 }}>Content hash to verify</label>
            <input
              value={verifyHash}
              onChange={e => setVerifyHash(e.target.value)}
              placeholder="0x..."
              style={{ ...inputStyle, fontFamily: "monospace" }}
              required
            />
            <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>
              Enter the content hash you received when recording a disclosure.
            </p>
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#534AB7",
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Verify on Blockchain
          </button>

          {verifyResult && verifyResult.found && (
            <div style={successBox}>
              <p style={{ fontWeight: 500, color: "#1b5e20", margin: "0 0 12px" }}>
                Disclosure found on blockchain
              </p>
              <table style={{ fontSize: 13, borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  {[
                    ["AI used", verifyResult.aiUsed ? "Yes" : "No"],
                    ["AI tool", verifyResult.aiToolName || "—"],
                    ["Usage type", verifyResult.aiUsageType || "—"],
                    ["Creator", verifyResult.creator],
                    ["Recorded at", verifyResult.timestampReadable],
                    ["IPFS URI", verifyResult.metadataURI || "—"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ padding: "4px 8px", fontWeight: 500, color: "#555", whiteSpace: "nowrap" }}>{k}</td>
                      <td style={{ padding: "4px 8px", wordBreak: "break-all" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {verifyError && (
            <div style={errorBox}>
              <p style={{ color: "#b71c1c", margin: 0 }}>{verifyError}</p>
            </div>
          )}
        </form>
      )}

      {/* ── Tab 3: Creator History ── */}
      {tab === "history" && (
        <form onSubmit={handleHistory} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontWeight: 500 }}>Creator wallet address</label>
            <input
              value={historyAddress}
              onChange={e => setHistoryAddress(e.target.value)}
              placeholder="0x..."
              style={{ ...inputStyle, fontFamily: "monospace" }}
              required
            />
            <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>
              Enter a wallet address to see all disclosures made by that creator.
            </p>
          </div>

          {/* Quick fill button */}
          <button
            type="button"
            onClick={() => setHistoryAddress(DEFAULT_WALLET)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #534AB7",
              background: "transparent",
              color: "#534AB7",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              alignSelf: "flex-start",
            }}
          >
            Use default wallet address
          </button>

          <button
            type="submit"
            disabled={historyLoading}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: historyLoading ? "#999" : "#534AB7",
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            {historyLoading ? "Fetching history..." : "Get Creator History"}
          </button>

          {historyResult && (
            <div style={successBox}>
              <p style={{ fontWeight: 500, color: "#1b5e20", margin: "0 0 12px" }}>
                {historyResult.disclosures.length === 0
                  ? "No disclosures found for this address"
                  : `Found ${historyResult.disclosures.length} disclosure(s) for this creator`}
              </p>
              {historyResult.disclosures.length > 0 && (
                <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #c8e6c9" }}>
                      <td style={{ padding: "4px 8px", fontWeight: 500, color: "#2e7d32" }}>#</td>
                      <td style={{ padding: "4px 8px", fontWeight: 500, color: "#2e7d32" }}>Content Hash</td>
                    </tr>
                  </thead>
                  <tbody>
                    {historyResult.disclosures.map((hash, index) => (
                      <tr key={hash} style={{ borderBottom: "1px solid #e8f5e9" }}>
                        <td style={{ padding: "6px 8px", color: "#555" }}>{index + 1}</td>
                        <td style={{
                          padding: "6px 8px",
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}>
                          {hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {historyError && (
            <div style={errorBox}>
              <p style={{ color: "#b71c1c", margin: 0 }}>{historyError}</p>
            </div>
          )}
        </form>
      )}

    </div>
  );
}
